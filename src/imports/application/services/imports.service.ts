import { Injectable } from '@nestjs/common';
import { TransactionsService } from '../../../transactions/application/services/transactions.service';
import { AccountsService } from '../../../accounts/application/services/accounts.service';
import { CreateTransactionDto } from '../../../transactions/infra/dtos/create-transaction.dto';
import { TransactionType } from '../../../transactions/infra/entities/transaction.entity';

@Injectable()
export class ImportsService {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly accountsService: AccountsService,
  ) {}

  async importOfx(userId: string, accountId: string, fileBuffer: Buffer) {
    // 1. Validar conta
    await this.accountsService.findOne(userId, accountId);

    const ofxContent = fileBuffer.toString('utf-8');
    const transactions = this.parseOfx(ofxContent);

    let importedCount = 0;
    let skippedCount = 0;

    for (const trx of transactions) {
      // Check duplicate
      const existing = await this.transactionsService.findByExternalId(
        userId,
        trx.fitId,
      );
      if (existing) {
        skippedCount++;
        continue;
      }

      // Map to DTO
      const amount = parseFloat(trx.amount);
      const type =
        amount < 0 ? TransactionType.EXPENSE : TransactionType.INCOME;
      const absAmount = Math.abs(amount);

      // Parse Date (YYYYMMDDHHMMSS)
      // OFX Date: 20230215120000[-3:BRT] or just 20230215
      const dateStr = trx.date.substring(0, 8); // YYYYMMDD
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1;
      const day = parseInt(dateStr.substring(6, 8));
      const date = new Date(year, month, day);

      const description = trx.memo || trx.name || 'Imported Transaction';

      const dto: CreateTransactionDto = {
        accountId,
        amount: absAmount,
        type,
        date: date.toISOString(),
        description,
        externalId: trx.fitId,
        category: 'Outros', // Default category or logic to auto-categorize
        // categoryId: ... could try to find a default "Uncategorized" category
      };

      await this.transactionsService.create(userId, dto);
      importedCount++;
    }

    return {
      total: transactions.length,
      imported: importedCount,
      skipped: skippedCount,
    };
  }

  private parseOfx(content: string) {
    const transactions: Array<{
      type: string;
      date: string;
      amount: string;
      fitId: string;
      name: string;
      memo: string;
    }> = [];

    // Simple regex parser for SGML/XML OFX
    // Extract BANKTRANLIST
    const bankTranListMatch = content.match(
      /<BANKTRANLIST>([\s\S]*?)<\/BANKTRANLIST>/i,
    );
    if (!bankTranListMatch) {
      // Try finding STMTTRN directly if BANKTRANLIST is missing/malformed
    }

    const listContent = bankTranListMatch ? bankTranListMatch[1] : content;

    // Split by STMTTRN
    const rawTransactions = listContent.split('<STMTTRN>');

    for (const raw of rawTransactions) {
      if (!raw.trim()) continue;

      const type = this.getTagValue(raw, 'TRNTYPE');
      const date = this.getTagValue(raw, 'DTPOSTED');
      const amount = this.getTagValue(raw, 'TRNAMT');
      const fitId = this.getTagValue(raw, 'FITID');
      const name = this.getTagValue(raw, 'NAME');
      const memo = this.getTagValue(raw, 'MEMO');

      if (date && amount && fitId) {
        transactions.push({ type, date, amount, fitId, name, memo });
      }
    }

    return transactions;
  }

  private getTagValue(content: string, tagName: string): string {
    // Matches <TAG>Value< or <TAG>Value\n
    const regex = new RegExp(`<${tagName}>([^<\\r\\n]+)`, 'i');
    const match = content.match(regex);
    if (match) return match[1].trim();

    // Try with closing tag
    const regexClosed = new RegExp(`<${tagName}>([^<]+)</${tagName}>`, 'i');
    const matchClosed = content.match(regexClosed);
    return matchClosed ? matchClosed[1].trim() : '';
  }
}
