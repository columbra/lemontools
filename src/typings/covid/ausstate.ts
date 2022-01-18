// Generated by https://quicktype.io

export interface NSWCovidDataDaily {
  data: Datum[];
}

export interface Datum {
  LocalCasesWithKnownSource: number;
  OverseasCases: number;
  LocalCases: number;
  Tested: number;
  CaseStatsReportingDateUnixTimestamp: number;
  concurrentHospitalisationsIcu: number;
  ActiveCases: number;
  Test_24hrs: number;
  LocalCases_24hrs: number;
  CaseStatsReportingDate: string;
  InterStateCases: number;
  TestStatsReportingDateUnixTimestamp: number;
  Deaths: number;
  InterStateCases_24hrs: number;
  concurrentHospitalisationsVentilated: number;
  OverseasCases_24hrs: number;
  concurrentHospitalisations: number;
  LocalCasesWithKnownSource_24hrs: number;
  TestStatsReportingDate: string;
  hospitalisationsReportingDateUnixTimestamp: number;
  LocalCasesWithUnknownSource: number;
  hospitalisationsReportingDate: string;
  NewCases: number;
  LocalCasesWithUnknownSource_24hrs: number;
  DeltaCases: number;
  Cases: number;
}