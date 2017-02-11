import { JsonConverter } from "./json-converter.service";
describe('Json converter', () => {
  let converter: JsonConverter;
  let mock: any;

  beforeEach(() => {
    converter = new JsonConverter();
    mocks();
  });

  describe('csvToJson', () => {
    beforeEach(() => {
      spyOn(JsonConverter, 'parseCsv').and.callThrough();
      spyOn(converter, 'parseError').and.callThrough();
    });

    it('should call parseCsv', () => {
      converter.csvToJson(mock.csvWithHeaders);
      expect(JsonConverter.parseCsv).toHaveBeenCalled();
    });

    it('should check for header errors and truncate until they are gone', () => {
      const result = converter.csvToJson(mock.csvWithHeaders);
      expect(converter.parseError).toHaveBeenCalledTimes(5);
      expect(converter.parseError(result)).toBe(false);
      expect(result.data.length).toBe(2);
    });

    it('should strip off footers with too few fields', () => {
      const result = converter.csvToJson(mock.csvWithFooters);
      expect(result.data.length).toBe(2);
    });
  });


  ////////

  function mocks() {
    mock = {
      csvWithHeaders: `Transactions personliches Konto (00);;;Customer number: 123 456789
        01/05/2017 - 02/03/2017
        Old balance:;;;;88,888.88;EUR
        Transactions pending are not included in this report.
        Booking date;Value date;Transaction Type;Beneficiary / Originator;Payment Details;IBAN;BIC;Customer Reference;Mandate Reference;Creditor ID;Compensation amount;Original Amount;Ultimate creditor;Number of transactions;Number of cheques;Debit;Credit;Currency
        02/03/2017;02/03/2017;"SEPA-Direct Debit (ELV)";KAISERS TENGELMANN GMBH;ELV61291198 01.02 19.00 ME8 VIELEN DANK;DE0000000000000000000;XXXXXXXXXX;IC-2349874357;3409853048043850;DE340958340958;;;;;;-9.99;;EUR
        02/02/2017;02/02/2017;"SEPA-Standing Order";Mietkonto Pandastr. 10, 10a/ Panda platz 5;RINP Dauerauftrag Rent for Pandas in Pandaplatz 5;DE09340958340580;XXXXXXXXX;;;;;;;;;-5,555.55;;EUR
      `,
      csvWithFooters: `Booking date;Value date;Transaction Type;Beneficiary / Originator;Payment Details;IBAN;BIC;Customer Reference;Mandate Reference;Creditor ID;Compensation amount;Original Amount;Ultimate creditor;Number of transactions;Number of cheques;Debit;Credit;Currency
        02/03/2017;02/03/2017;"SEPA-Direct Debit (ELV)";KAISERS TENGELMANN GMBH;ELV61291198 01.02 19.00 ME8 VIELEN DANK;DE0000000000000000000;XXXXXXXXXX;IC-2349874357;3409853048043850;DE340958340958;;;;;;-9.99;;EUR
        02/02/2017;02/02/2017;"SEPA-Standing Order";Mietkonto Pandastr. 10, 10a/ Panda platz 5;RINP Dauerauftrag Rent for Pandas in Pandaplatz 5;DE09340958340580;XXXXXXXXX;;;;;;;;;-5,555.55;;EUR
        Footer row with; not ; enough; separators
        `
    };
  }
});