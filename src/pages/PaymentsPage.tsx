
import React, { useState } from "react";
import { 
  BarChart3, 
  Building, 
  Calendar, 
  Check, 
  Clock, 
  Download, 
  Filter, 
  PlusCircle, 
  Search, 
  SlidersHorizontal, 
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuCheckboxItem,
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Sample Payments Data
const paymentsData = [
  {
    id: "1",
    facilityName: "Sunset Senior Living",
    facilityType: "Assisted Living",
    residentName: "Eleanor Johnson",
    amount: 1500,
    status: "Paid",
    paymentDate: "2023-09-15",
    dueDate: "2023-09-10",
    paymentMethod: "Direct Deposit",
    notes: "Payment for September placement",
    facilityImage: "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    residentImage: "https://images.unsplash.com/photo-1581579438747-e5b6bdc752df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "2",
    facilityName: "Golden Years Home",
    facilityType: "Memory Care",
    residentName: "Robert Wilson",
    amount: 1200,
    status: "Paid",
    paymentDate: "2023-09-05",
    dueDate: "2023-09-01",
    paymentMethod: "Check",
    notes: "Payment for August placement",
    facilityImage: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    residentImage: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "3",
    facilityName: "Serenity Care Center",
    facilityType: "Skilled Nursing",
    residentName: "Maria Garcia",
    amount: 1800,
    status: "Pending",
    paymentDate: null,
    dueDate: "2023-10-15",
    paymentMethod: null,
    notes: "Awaiting payment for October placement",
    facilityImage: "https://images.unsplash.com/photo-1595773650024-ded0b394542f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    residentImage: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "4",
    facilityName: "Riverside Retirement",
    facilityType: "Independent Living",
    residentName: "James Smith",
    amount: 1000,
    status: "Late",
    paymentDate: null,
    dueDate: "2023-09-30",
    paymentMethod: null,
    notes: "Payment reminder sent on Oct 5",
    facilityImage: "https://images.unsplash.com/photo-1584132905271-512c958d674a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    residentImage: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: "5",
    facilityName: "Oakwood Senior Community",
    facilityType: "Assisted Living",
    residentName: "Elizabeth Brown",
    amount: 1350,
    status: "Paid",
    paymentDate: "2023-10-02",
    dueDate: "2023-10-01",
    paymentMethod: "Direct Deposit",
    notes: "Payment for October placement",
    facilityImage: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    residentImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
  }
];

// Sample Monthly Revenue Data for Chart
const monthlyRevenueData = [
  { month: 'Jan', revenue: 3500 },
  { month: 'Feb', revenue: 4200 },
  { month: 'Mar', revenue: 3800 },
  { month: 'Apr', revenue: 5100 },
  { month: 'May', revenue: 4700 },
  { month: 'Jun', revenue: 5800 },
  { month: 'Jul', revenue: 6200 },
  { month: 'Aug', revenue: 5500 },
  { month: 'Sep', revenue: 6800 },
  { month: 'Oct', revenue: 4500 },
  { month: 'Nov', revenue: 0 },
  { month: 'Dec', revenue: 0 },
];

// Sample Facility Revenue Data for Chart
const facilityRevenueData = [
  { name: 'Sunset Senior Living', revenue: 4500 },
  { name: 'Golden Years Home', revenue: 3600 },
  { name: 'Serenity Care Center', revenue: 1800 },
  { name: 'Riverside Retirement', revenue: 2500 },
  { name: 'Oakwood Senior Community', revenue: 2700 },
];

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const PaymentsPage = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPayments, setFilteredPayments] = useState(paymentsData);
  const [selectedStatusFilters, setSelectedStatusFilters] = useState<string[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<'ytd' | 'lastMonth' | 'lastYear'>('ytd');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  
  // Calculate total stats
  const totalPaid = paymentsData
    .filter(payment => payment.status === 'Paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalPending = paymentsData
    .filter(payment => payment.status === 'Pending')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalLate = paymentsData
    .filter(payment => payment.status === 'Late')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalRevenue = totalPaid + totalPending + totalLate;
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      
      const matched = paymentsData.filter(
        payment => 
          payment.facilityName.toLowerCase().includes(query) ||
          payment.residentName.toLowerCase().includes(query) ||
          payment.facilityType.toLowerCase().includes(query) ||
          (payment.notes && payment.notes.toLowerCase().includes(query))
      );
      
      setFilteredPayments(matched);
    } else {
      applyStatusFilters();
    }
  };

  // Apply status filters
  const applyStatusFilters = () => {
    if (selectedStatusFilters.length === 0) {
      setFilteredPayments(paymentsData);
    } else {
      const filtered = paymentsData.filter(payment => 
        selectedStatusFilters.includes(payment.status)
      );
      setFilteredPayments(filtered);
    }
  };

  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    setSelectedStatusFilters(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  // Apply filters when changed
  React.useEffect(() => {
    applyStatusFilters();
  }, [selectedStatusFilters]);

  // Handle export
  const handleExport = () => {
    toast({
      title: "Payments Exported",
      description: "The payment records have been exported to CSV successfully.",
    });
  };

  // Handle adding new payment
  const handleAddPayment = () => {
    toast({
      title: "Feature Coming Soon",
      description: "The ability to add payments will be available in a future update.",
    });
    setIsPaymentDialogOpen(false);
  };

  // Handle marking as paid
  const handleMarkAsPaid = (paymentId: string) => {
    toast({
      title: "Payment Marked as Paid",
      description: "The payment status has been updated successfully.",
    });
    
    // Update the local state (in a real app this would call an API)
    const updatedPayments = filteredPayments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] } 
        : payment
    );
    
    setFilteredPayments(updatedPayments);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Track and manage your commission payments from facilities.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card animate-zoom-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Year to date</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-zoom-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {paymentsData.filter(p => p.status === 'Paid').length} payments
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-zoom-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{formatCurrency(totalPending)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {paymentsData.filter(p => p.status === 'Pending').length} payments
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-zoom-in" style={{ animationDelay: '400ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Late
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalLate)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {paymentsData.filter(p => p.status === 'Late').length} payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <Tabs defaultValue="monthly" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="monthly">Monthly Revenue</TabsTrigger>
            <TabsTrigger value="facility">By Facility</TabsTrigger>
          </TabsList>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {selectedTimeFrame === 'ytd' ? 'Year to Date' : 
                 selectedTimeFrame === 'lastMonth' ? 'Last Month' : 'Last Year'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Time Frame</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedTimeFrame('ytd')}>
                Year to Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedTimeFrame('lastMonth')}>
                Last Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedTimeFrame('lastYear')}>
                Last Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <TabsContent value="monthly">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]}>
                    {monthlyRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.revenue > 0 ? '#0ea5e9' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="facility">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={facilityRevenueData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={(value) => `$${value}`} />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Revenue']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by facility, resident, or payment details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
                {selectedStatusFilters.length > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {selectedStatusFilters.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={selectedStatusFilters.includes('Paid')}
                onCheckedChange={() => toggleStatusFilter('Paid')}
              >
                Paid
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatusFilters.includes('Pending')}
                onCheckedChange={() => toggleStatusFilter('Pending')}
              >
                Pending
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={selectedStatusFilters.includes('Late')}
                onCheckedChange={() => toggleStatusFilter('Late')}
              >
                Late
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-healthcare-600">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Payment</DialogTitle>
                <DialogDescription>
                  Add details for a new commission payment.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Facility</label>
                  <select className="w-full p-2 rounded-md border">
                    <option value="">Select a facility</option>
                    <option value="sunset">Sunset Senior Living</option>
                    <option value="golden">Golden Years Home</option>
                    <option value="serenity">Serenity Care Center</option>
                    <option value="riverside">Riverside Retirement</option>
                    <option value="oakwood">Oakwood Senior Community</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resident</label>
                  <select className="w-full p-2 rounded-md border">
                    <option value="">Select a resident</option>
                    <option value="eleanor">Eleanor Johnson</option>
                    <option value="robert">Robert Wilson</option>
                    <option value="maria">Maria Garcia</option>
                    <option value="james">James Smith</option>
                    <option value="elizabeth">Elizabeth Brown</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount ($)</label>
                  <input type="number" className="w-full p-2 rounded-md border" placeholder="Enter amount" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Due Date</label>
                  <input type="date" className="w-full p-2 rounded-md border" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <textarea className="w-full p-2 rounded-md border" placeholder="Add notes..." rows={3}></textarea>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-healthcare-600" onClick={handleAddPayment}>
                    Save Payment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <BarChart3 className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">No payments found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={() => setIsPaymentDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Payment
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredPayments.map((payment, index) => (
            <Card key={payment.id} className="glass-card overflow-hidden transition-all duration-300 hover:shadow-lg animate-zoom-in" style={{ animationDelay: `${500 + index * 100}ms` }}>
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="p-4 md:p-6 flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={payment.facilityImage} />
                          <AvatarFallback>
                            <Building className="h-6 w-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{payment.facilityName}</h3>
                          <div className="text-sm text-muted-foreground">
                            {payment.facilityType}
                          </div>
                        </div>
                      </div>
                      
                      <div className="md:ml-auto flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={payment.residentImage} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <div>Resident:</div>
                          <div className="font-medium">{payment.residentName}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                      <div>
                        <div className="text-sm text-muted-foreground">Amount</div>
                        <div className="font-bold text-lg">{formatCurrency(payment.amount)}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Status</div>
                        <Badge
                          className={
                            payment.status === 'Paid' 
                              ? 'bg-green-100 text-green-700' 
                              : payment.status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Due Date</div>
                        <div className="font-medium">{formatDate(payment.dueDate)}</div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-muted-foreground">Payment Date</div>
                        <div className="font-medium">
                          {payment.paymentDate ? formatDate(payment.paymentDate) : 'Not paid yet'}
                        </div>
                      </div>
                    </div>
                    
                    {payment.notes && (
                      <div className="mt-4 text-sm text-muted-foreground">
                        <span className="font-medium">Notes:</span> {payment.notes}
                      </div>
                    )}
                    
                    <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                      {payment.status !== 'Paid' && (
                        <Button 
                          variant="outline" 
                          className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                          onClick={() => handleMarkAsPaid(payment.id)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </Button>
                      )}
                      <Button variant="outline">Send Reminder</Button>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                  
                  {payment.status === 'Late' && (
                    <div className="bg-red-50 p-4 border-l-4 border-red-500 flex items-center md:w-48 md:border-l-0 md:border-l-4">
                      <div className="text-center w-full">
                        <Clock className="h-6 w-6 text-red-500 mx-auto mb-2" />
                        <div className="text-sm font-medium text-red-700">
                          Payment Overdue
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          {/* Calculate days overdue */}
                          {Math.floor((new Date().getTime() - new Date(payment.dueDate).getTime()) / (1000 * 3600 * 24))} days
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
