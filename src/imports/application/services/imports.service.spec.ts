import { Test, TestingModule } from '@nestjs/testing';
import { ImportsService } from './imports.service';
import { TransactionsService } from '../../../transactions/application/services/transactions.service';
import { AccountsService } from '../../../accounts/application/services/accounts.service';

const mockTransactionsService = {
  create: jest.fn(),
  findByExternalId: jest.fn(),
};

const mockAccountsService = {
  findOne: jest.fn(),
};

describe('ImportsService', () => {
  let service: ImportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportsService,
        { provide: TransactionsService, useValue: mockTransactionsService },
        { provide: AccountsService, useValue: mockAccountsService },
      ],
    }).compile();

    service = module.get<ImportsService>(ImportsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should parse OFX and create transactions', async () => {
    const userId = 'user-1';
    const accountId = 'acc-1';
    const ofxContent = `
OFXHEADER:100
DATA:OFXSGML
<OFX>
<BANKMSGSRSV1>
<STMTTRNRS>
<STMTRS>
<BANKTRANLIST>
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20230510120000
<TRNAMT>-50.00
<FITID>20230510-001
<MEMO>Supermercado
</STMTTRN>
<STMTTRN>
<TRNTYPE>CREDIT
<DTPOSTED>20230511120000
<TRNAMT>1000.00
<FITID>20230511-002
<MEMO>Salário
</STMTTRN>
</BANKTRANLIST>
</STMTRS>
</STMTTRNRS>
</BANKMSGSRSV1>
</OFX>
    `;
    const buffer = Buffer.from(ofxContent);

    mockAccountsService.findOne.mockResolvedValue({ id: accountId, userId });
    mockTransactionsService.findByExternalId.mockResolvedValue(null); // No duplicates
    mockTransactionsService.create.mockResolvedValue({ id: 'trx-1' });

    const result = await service.importOfx(userId, accountId, buffer);

    expect(result).toEqual({
      total: 2,
      imported: 2,
      skipped: 0,
    });

    expect(mockTransactionsService.create).toHaveBeenCalledTimes(2);
    // Verify first transaction (Expense)
    expect(mockTransactionsService.create).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        amount: 50.0,
        description: 'Supermercado',
        externalId: '20230510-001',
      }),
    );
    // Verify second transaction (Income)
    expect(mockTransactionsService.create).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        amount: 1000.0,
        description: 'Salário',
        externalId: '20230511-002',
      }),
    );
  });

  it('should skip duplicates', async () => {
    const userId = 'user-1';
    const accountId = 'acc-1';
    const ofxContent = `
<STMTTRN>
<TRNTYPE>DEBIT
<DTPOSTED>20230510120000
<TRNAMT>-50.00
<FITID>existing-id
<MEMO>Supermercado
</STMTTRN>
    `;
    const buffer = Buffer.from(ofxContent);

    mockAccountsService.findOne.mockResolvedValue({ id: accountId, userId });
    mockTransactionsService.findByExternalId.mockResolvedValue({
      id: 'existing',
    }); // Exists

    const result = await service.importOfx(userId, accountId, buffer);

    expect(result).toEqual({
      total: 1,
      imported: 0,
      skipped: 1,
    });

    expect(mockTransactionsService.create).not.toHaveBeenCalled();
  });
});
