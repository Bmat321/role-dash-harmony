import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Eye, Calculator, DollarSign, Plus, Edit, Trash2 } from 'lucide-react';
import { PayrollRecord, SalaryStructure } from '@/types/payroll';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const mockPayrollRecords: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '4',
    employeeName: 'Jane Doe',
    month: 'January',
    year: 2024,
    basicSalary: 70000,
    allowances: [
      { name: 'Housing', amount: 10000 },
      { name: 'Transport', amount: 5000 }
    ],
    bonuses: [
      { name: 'Performance', amount: 8000 }
    ],
    deductions: [
      { name: 'Tax', amount: 12000 },
      { name: 'Insurance', amount: 2000 }
    ],
    grossSalary: 93000,
    tax: 12000,
    netSalary: 79000,
    status: 'paid',
    paidDate: '2024-01-31'
  }
];

const mockSalaryStructures: SalaryStructure[] = [
  {
    employeeId: '4',
    basicSalary: 70000,
    allowances: [
      { name: 'Housing', amount: 10000, type: 'fixed' },
      { name: 'Transport', amount: 5000, type: 'fixed' }
    ],
    deductions: [
      { name: 'Insurance', amount: 2000, type: 'fixed' },
      { name: 'Tax', amount: 15, type: 'percentage' }
    ]
  }
];

const PayrollManagement: React.FC = () => {
  const { user } = useAuth();
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayrollRecords);
  const [salaryStructures, setSalaryStructures] = useState<SalaryStructure[]>(mockSalaryStructures);
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PayrollRecord | null>(null);
  
  // Form states for creating new payroll records
  const [newRecord, setNewRecord] = useState({
    employeeName: '',
    month: 'January',
    year: 2024,
    basicSalary: 0,
    allowances: [{ name: '', amount: 0 }],
    deductions: [{ name: '', amount: 0 }]
  });

  const canManagePayroll = user?.role === 'admin' || user?.role === 'hr';

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = ['2024', '2023', 2022];

  const getStatusBadge = (status: PayrollRecord['status']) => {
    const variants = {
      draft: 'outline',
      processed: 'secondary',
      paid: 'default'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleCreateRecord = () => {
    const grossSalary = newRecord.basicSalary + newRecord.allowances.reduce((sum, a) => sum + a.amount, 0);
    const totalDeductions = newRecord.deductions.reduce((sum, d) => sum + d.amount, 0);
    const netSalary = grossSalary - totalDeductions;

    const record: PayrollRecord = {
      id: (payrollRecords.length + 1).toString(),
      employeeId: (payrollRecords.length + 1).toString(),
      employeeName: newRecord.employeeName,
      month: newRecord.month,
      year: newRecord.year,
      basicSalary: newRecord.basicSalary,
      allowances: newRecord.allowances.filter(a => a.name && a.amount > 0),
      bonuses: [],
      deductions: newRecord.deductions.filter(d => d.name && d.amount > 0),
      grossSalary,
      tax: totalDeductions,
      netSalary,
      status: 'draft'
    };

    setPayrollRecords([...payrollRecords, record]);
    setIsCreateDialogOpen(false);
    setNewRecord({
      employeeName: '',
      month: 'January',
      year: 2024,
      basicSalary: 0,
      allowances: [{ name: '', amount: 0 }],
      deductions: [{ name: '', amount: 0 }]
    });

    toast({
      title: "Payroll Record Created",
      description: `Payroll record for ${record.employeeName} has been created successfully.`,
    });
  };

  const handleEditRecord = (record: PayrollRecord) => {
    setEditingRecord(record);
    setIsEditDialogOpen(true);
  };

  const handleDeleteRecord = (recordId: string) => {
    setPayrollRecords(payrollRecords.filter(r => r.id !== recordId));
    toast({
      title: "Record Deleted",
      description: "Payroll record has been deleted successfully.",
    });
  };

  const addAllowanceField = () => {
    setNewRecord({
      ...newRecord,
      allowances: [...newRecord.allowances, { name: '', amount: 0 }]
    });
  };

  const addDeductionField = () => {
    setNewRecord({
      ...newRecord,
      deductions: [...newRecord.deductions, { name: '', amount: 0 }]
    });
  };

  const handleDownloadPayslip = (record: PayrollRecord) => {
    toast({
      title: "Payslip Download",
      description: `Payslip for ${record.month} ${record.year} would be downloaded.`,
    });
  };

  const handleViewPayslip = (record: PayrollRecord) => {
    setSelectedPayslip(record);
  };

  const filteredRecords = payrollRecords.filter(record => {
    if (!canManagePayroll && record.employeeId !== user?.id) return false;
    return record.month === selectedMonth && record.year.toString() === selectedYear;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payroll Management</h2>
          <p className="text-gray-600">Manage salary records and payslips</p>
        </div>
        {canManagePayroll && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Payroll Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Payroll Record</DialogTitle>
                <DialogDescription>Enter the payroll details for the employee</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employeeName">Employee Name</Label>
                    <Input
                      id="employeeName"
                      value={newRecord.employeeName}
                      onChange={(e) => setNewRecord({...newRecord, employeeName: e.target.value})}
                      placeholder="Enter employee name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="basicSalary">Basic Salary</Label>
                    <Input
                      id="basicSalary"
                      type="number"
                      value={newRecord.basicSalary}
                      onChange={(e) => setNewRecord({...newRecord, basicSalary: Number(e.target.value)})}
                      placeholder="Enter basic salary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Month</Label>
                    <Select 
                      value={newRecord.month} 
                      onValueChange={(value) => setNewRecord({...newRecord, month: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month} value={month}>{month}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Year</Label>
                    <Select 
                      value={newRecord.year.toString()} 
                      onValueChange={(value) => setNewRecord({...newRecord, year: Number(value)})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label>Allowances</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addAllowanceField}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Allowance
                    </Button>
                  </div>
                  {newRecord.allowances.map((allowance, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        placeholder="Allowance name"
                        value={allowance.name}
                        onChange={(e) => {
                          const updated = [...newRecord.allowances];
                          updated[index].name = e.target.value;
                          setNewRecord({...newRecord, allowances: updated});
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={allowance.amount}
                        onChange={(e) => {
                          const updated = [...newRecord.allowances];
                          updated[index].amount = Number(e.target.value);
                          setNewRecord({...newRecord, allowances: updated});
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label>Deductions</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addDeductionField}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Deduction
                    </Button>
                  </div>
                  {newRecord.deductions.map((deduction, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        placeholder="Deduction name"
                        value={deduction.name}
                        onChange={(e) => {
                          const updated = [...newRecord.deductions];
                          updated[index].name = e.target.value;
                          setNewRecord({...newRecord, deductions: updated});
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={deduction.amount}
                        onChange={(e) => {
                          const updated = [...newRecord.deductions];
                          updated[index].amount = Number(e.target.value);
                          setNewRecord({...newRecord, deductions: updated});
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRecord}>
                    Create Record
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="payslips" className="space-y-6">
        <TabsList>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="structure">Salary Structure</TabsTrigger>
          {canManagePayroll && <TabsTrigger value="overview">Payroll Overview</TabsTrigger>}
        </TabsList>

        <TabsContent value="payslips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payslip Records</CardTitle>
              <CardDescription>View and manage payslips</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    {canManagePayroll && <TableHead>Employee</TableHead>}
                    <TableHead>Period</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Gross Salary</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      {canManagePayroll && (
                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                      )}
                      <TableCell>
                        <div>{record.month} {record.year}</div>
                        {record.paidDate && (
                          <div className="text-sm text-gray-500">
                            Paid: {new Date(record.paidDate).toLocaleDateString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        ${record.basicSalary.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        ${record.grossSalary.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        ${record.deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">
                        ${record.netSalary.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPayslip(record)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadPayslip(record)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {canManagePayroll && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditRecord(record)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteRecord(record.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Salary Components
                </CardTitle>
                <CardDescription>Your salary structure breakdown</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Basic Salary</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      ${salaryStructures[0]?.basicSalary.toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">Per month</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Allowances</h4>
                  <div className="space-y-2">
                    {salaryStructures[0]?.allowances.map((allowance, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span>{allowance.name}</span>
                        <span className="font-medium text-green-600">
                          {allowance.type === 'percentage' 
                            ? `${allowance.amount}%` 
                            : `$${allowance.amount.toLocaleString()}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Deductions</h4>
                  <div className="space-y-2">
                    {salaryStructures[0]?.deductions.map((deduction, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span>{deduction.name}</span>
                        <span className="font-medium text-red-600">
                          {deduction.type === 'percentage' 
                            ? `${deduction.amount}%` 
                            : `$${deduction.amount.toLocaleString()}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Salary Calculation
                </CardTitle>
                <CardDescription>How your salary is calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Basic Salary:</span>
                    <span className="font-medium">${salaryStructures[0]?.basicSalary.toLocaleString()}</span>
                  </div>
                  
                  {salaryStructures[0]?.allowances.map((allowance, index) => (
                    <div key={index} className="flex justify-between text-green-600">
                      <span>+ {allowance.name}:</span>
                      <span className="font-medium">
                        ${allowance.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Gross Salary:</span>
                      <span>${(salaryStructures[0]?.basicSalary + salaryStructures[0]?.allowances.reduce((sum, a) => sum + a.amount, 0)).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {salaryStructures[0]?.deductions.map((deduction, index) => (
                    <div key={index} className="flex justify-between text-red-600">
                      <span>- {deduction.name}:</span>
                      <span className="font-medium">
                        {deduction.type === 'percentage'
                          ? `$${Math.round((salaryStructures[0].basicSalary * deduction.amount) / 100).toLocaleString()}`
                          : `$${deduction.amount.toLocaleString()}`}
                      </span>
                    </div>
                  ))}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Net Salary:</span>
                      <span className="text-blue-600">
                        ${(salaryStructures[0]?.basicSalary + 
                           salaryStructures[0]?.allowances.reduce((sum, a) => sum + a.amount, 0) -
                           salaryStructures[0]?.deductions.reduce((sum, d) => 
                             d.type === 'percentage' 
                               ? sum + Math.round((salaryStructures[0].basicSalary * d.amount) / 100)
                               : sum + d.amount, 0)
                          ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {canManagePayroll && (
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">$450K</div>
                  <p className="text-sm text-gray-600">Total Payroll</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">25</div>
                  <p className="text-sm text-gray-600">Employees Paid</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">$18K</div>
                  <p className="text-sm text-gray-600">Average Salary</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">$67K</div>
                  <p className="text-sm text-gray-600">Total Deductions</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>All Employee Payroll</CardTitle>
                <CardDescription>Complete payroll overview</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Basic Salary</TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{record.employeeName}</TableCell>
                        <TableCell>Engineering</TableCell>
                        <TableCell>${record.basicSalary.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600 font-medium">
                          ${record.grossSalary.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-blue-600 font-bold">
                          ${record.netSalary.toLocaleString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Payslip Detail Dialog */}
      <Dialog open={!!selectedPayslip} onOpenChange={() => setSelectedPayslip(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payslip Details</DialogTitle>
            <DialogDescription>
              {selectedPayslip && `${selectedPayslip.month} ${selectedPayslip.year} - ${selectedPayslip.employeeName}`}
            </DialogDescription>
          </DialogHeader>
          {selectedPayslip && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Earnings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Basic Salary:</span>
                      <span className="font-medium">${selectedPayslip.basicSalary.toLocaleString()}</span>
                    </div>
                    {selectedPayslip.allowances.map((allowance, index) => (
                      <div key={index} className="flex justify-between text-green-600">
                        <span>{allowance.name}:</span>
                        <span>${allowance.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    {selectedPayslip.bonuses.map((bonus, index) => (
                      <div key={index} className="flex justify-between text-blue-600">
                        <span>{bonus.name}:</span>
                        <span>${bonus.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 font-medium">
                      <div className="flex justify-between">
                        <span>Gross Salary:</span>
                        <span>${selectedPayslip.grossSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Deductions</h4>
                  <div className="space-y-2">
                    {selectedPayslip.deductions.map((deduction, index) => (
                      <div key={index} className="flex justify-between text-red-600">
                        <span>{deduction.name}:</span>
                        <span>${deduction.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 font-bold text-lg">
                      <div className="flex justify-between text-blue-600">
                        <span>Net Salary:</span>
                        <span>${selectedPayslip.netSalary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleDownloadPayslip(selectedPayslip)}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollManagement;
