import React, { ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { TestCase } from '../types';

interface FileUploaderProps {
  onImport: (testCases: TestCase[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onImport }) => {
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        const testCases: TestCase[] = data.map((row: any) => ({
          id: Date.now().toString(),
          title: row.Title,
          description: row.Description,
          steps: row.Steps.split('\n'),
          expectedResult: row.ExpectedResult,
          type: row.Type,
          createdBy: 'Imported',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        onImport(testCases);
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="inline-flex">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 cursor-pointer inline-flex items-center justify-center"
      >
        Import from Excel
      </label>
    </div>
  );
};