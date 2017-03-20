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

    it('should convert valid csv to json', () => {
      expect(converter.csvToJson(mock.csv).data).toEqual(mock.json.data);
    });
  });

  describe('parseError', () => {
    it('should return true if fewer than 3 fields were detected', () => {
      const parseResult = JsonConverter.parseCsv(mock.csvTooFewFields);
      expect(parseResult.meta.fields.length).toBe(2);
      expect(converter.parseError(parseResult)).toBe(true);
    });

    it('should return true if the first row has too many fields', () => {
      let parseResult = JsonConverter.parseCsv(mock.csvFirstRowTooManyFields);
      expect(parseResult.errors[0].type === 'FieldMismatch');
      expect(converter.parseError(parseResult)).toBe(true);

      parseResult = JsonConverter.parseCsv(mock.csvFirstRowTooFewFields);
      expect(parseResult.errors[0].type === 'FieldMismatch');
      expect(converter.parseError(parseResult)).toBe(true);
    });

    it('should return false otherwise', () => {
      expect(converter.parseError(JsonConverter.parseCsv(mock.csv))).toBe(false);
    });
  });

  describe('convertedJson', () => {
    it('should return null if json does not exist with data', () => {
      expect(converter.convertedJson(null,10,null)).toBe(null);
      expect(converter.convertedJson(mock.emptyResult,10,null)).toBe(null);
    });

    it('should convert json according to the lookup', () => {
      expect(converter.convertedJson(converter.csvToJson(mock.csv), mock.limit, mock.lookup)).toEqual(mock.jsonConverted);
    });

    it('should cut the result at limit', () => {
      expect(converter.convertedJson(converter.csvToJson(mock.csv), 1, mock.lookup)).toEqual(mock.jsonConverted.slice(0,1));
    });

    it('should split values to inflow and outflow by sign if coming from the same column', () => {
      const result = converter.convertedJson(converter.csvToJson(mock.csvPositiveNegative), mock.limit, mock.lookupOutAndInSame);
      expect(result).toEqual(mock.jsonConvertedPositiveNegative);
    });

    it('should call toFloat to convert outflow and inflows to floats', () => {
      spyOn(JsonConverter, 'toFloat');
      converter.convertedJson(converter.csvToJson(mock.csv), mock.limit, mock.lookup);
      expect(JsonConverter.toFloat).toHaveBeenCalledWith(-9.99);
      expect(JsonConverter.toFloat).toHaveBeenCalledWith('');
      expect(JsonConverter.toFloat).toHaveBeenCalledWith('-5,555.55');
    });
  });

  describe('convertedCsv', () => {
    it('should return an empty string if json is null or has no data', () => {
      expect(converter.convertedCsv(null, mock.limit, mock.lookup)).toBe('');
      expect(converter.convertedCsv(mock.emptyResult, mock.limit, mock.lookup)).toBe('');
    });

    it('should call convertedJson and parse the result back into a csv string', () => {
      expect(converter.convertedCsv(converter.csvToJson(mock.csv), 100, mock.lookup).trim()).toEqual(mock.csvConverted.trim());
    })
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
        `,
      csvTooFewFields: `Field 1,field 2
        value 1, value 2
        value 3, value 4
      `,
      csvFirstRowTooManyFields: `field1,field2
        value1, value2, value3
      `,
      csvFirstRowTooFewFields: `field1,field2,field3
        value1, value2
      `,
      csv: `Booking date;Value date;Transaction Type;Beneficiary / Originator;Payment Details;IBAN;BIC;Customer Reference;Mandate Reference;Creditor ID;Compensation amount;Original Amount;Ultimate creditor;Number of transactions;Number of cheques;Debit;Credit;Currency
02/03/2017;02/03/2017;"SEPA-Direct Debit (ELV)";KAISERS TENGELMANN GMBH;ELV61291198 01.02 19.00 ME8 VIELEN DANK;DE0000000000000000000;XXXXXXXXXX;IC-2349874357;3409853048043850;DE340958340958;;;;;;-9.99;;EUR
02/02/2017;02/02/2017;"SEPA-Standing Order";Mietkonto Pandastr. 10, 10a/ Panda platz 5;RINP Dauerauftrag Rent for Pandas in Pandaplatz 5;DE09340958340580;XXXXXXXXX;;;;;;;;;-5,555.55;;EUR
      `,
      csvConverted: `Date,Payee,Category,Memo,Outflow,Inflow
02/03/2017,ELV61291198 01.02 19.00 ME8 VIELEN DANK,,KAISERS TENGELMANN GMBH,9.99,0
02/02/2017,RINP Dauerauftrag Rent for Pandas in Pandaplatz 5,,"Mietkonto Pandastr. 10, 10a/ Panda platz 5",5555.55,0`,
      csvPositiveNegative: `Booking date;Value date;Transaction Type;Beneficiary / Originator;Payment Details;IBAN;BIC;Customer Reference;Mandate Reference;Creditor ID;Compensation amount;Original Amount;Ultimate creditor;Number of transactions;Number of cheques;Amount;Currency
02/03/2017;02/03/2017;"SEPA-Direct Debit (ELV)";KAISERS TENGELMANN GMBH;ELV61291198 01.02 19.00 ME8 VIELEN DANK;DE0000000000000000000;XXXXXXXXXX;IC-2349874357;3409853048043850;DE340958340958;;;;;;-9.99;EUR
02/02/2017;02/02/2017;"SEPA-Standing Order";Mietkonto Pandastr. 10, 10a/ Panda platz 5;RINP Dauerauftrag Rent for Pandas in Pandaplatz 5;DE09340958340580;XXXXXXXXX;;;;;;;;;5,555.55;EUR
      `,
      json: {
        data: [{
          "Booking date": "02/03/2017",
          "Value date": "02/03/2017",
          "Transaction Type": "SEPA-Direct Debit (ELV)",
          "Beneficiary / Originator": "KAISERS TENGELMANN GMBH",
          "Payment Details": "ELV61291198 01.02 19.00 ME8 VIELEN DANK",
          "IBAN": "DE0000000000000000000",
          "BIC": "XXXXXXXXXX",
          "Customer Reference": "IC-2349874357",
          "Mandate Reference": 3409853048043850,
          "Creditor ID": "DE340958340958",
          "Compensation amount": "",
          "Original Amount": "",
          "Ultimate creditor": "",
          "Number of transactions": "",
          "Number of cheques": "",
          "Debit": -9.99,
          "Credit": "",
          "Currency": "EUR"
        }, {
          "Booking date": "02/02/2017",
          "Value date": "02/02/2017",
          "Transaction Type": "SEPA-Standing Order",
          "Beneficiary / Originator": "Mietkonto Pandastr. 10, 10a/ Panda platz 5",
          "Payment Details": "RINP Dauerauftrag Rent for Pandas in Pandaplatz 5",
          "IBAN": "DE09340958340580",
          "BIC": "XXXXXXXXX",
          "Customer Reference": "",
          "Mandate Reference": "",
          "Creditor ID": "",
          "Compensation amount": "",
          "Original Amount": "",
          "Ultimate creditor": "",
          "Number of transactions": "",
          "Number of cheques": "",
          "Debit": "-5,555.55",
          "Credit": "",
          "Currency": "EUR"
        }]
      },
      jsonConverted: [
        {Date:"02/03/2017",Payee:"ELV61291198 01.02 19.00 ME8 VIELEN DANK",Memo:"KAISERS TENGELMANN GMBH",Outflow:9.99,Inflow:0, Category: undefined},
        {Date:"02/02/2017",Payee:"RINP Dauerauftrag Rent for Pandas in Pandaplatz 5",Memo:"Mietkonto Pandastr. 10, 10a/ Panda platz 5",Outflow:5555.55,Inflow:0, Category: undefined}
      ],
      jsonConvertedPositiveNegative: [
        {Date:"02/03/2017",Payee:"ELV61291198 01.02 19.00 ME8 VIELEN DANK",Memo:"KAISERS TENGELMANN GMBH",Outflow:9.99,Inflow:'', Category: undefined},
        {Date:"02/02/2017",Payee:"RINP Dauerauftrag Rent for Pandas in Pandaplatz 5",Memo:"Mietkonto Pandastr. 10, 10a/ Panda platz 5",Outflow:'',Inflow:5555.55, Category: undefined}
      ],
      limit: 3,
      lookup: {
        Date: 'Value date',
        Payee: 'Payment Details',
        Category: 'Category',
        Memo: 'Beneficiary / Originator',
        Outflow: 'Debit',
        Inflow: 'Credit'
      },
      lookupOutAndInSame: {
        Date: 'Value date',
        Payee: 'Payment Details',
        Category: 'Category',
        Memo: 'Beneficiary / Originator',
        Outflow: 'Amount',
        Inflow: 'Amount'
      },
      emptyResult: {data: null, errors: null, meta: null}
    };
  }
});