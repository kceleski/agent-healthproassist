
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { getUserTier } from '@/utils/subscription';
import {
  Bell,
  CalendarIcon,
  Clock,
  FileText,
  Link,
  MapPin,
  Plus,
  User,
  Users,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import AddToTaskButton from "@/components/todos/AddToTaskButton";
import TodoList from "@/components/todos/TodoList";
import ReminderSettings from "@/components/calendar/ReminderSettings";
import CalendarSync from "@/components/calendar/CalendarSync";

// Types
type Appointment = {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'tour' | 'meeting' | 'assessment' | 'follow-up';
  location: string;
  attendees: string[];
  notes: string;
  client: string;
};

const appointments: Appointment[] = [
  {
    id: '1',
    title: 'Facility Tour - Sunset Senior Living',
    date: new Date(2023, 6, 15, 10, 0),
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    type: 'tour',
    location: 'Sunset Senior Living, San Francisco',
    attendees: ['Robert Johnson', 'Sarah Johnson (daughter)', 'Mark Peterson (Sunset Manager)'],
    notes: 'Tour of assisted living facilities. Client is interested in a 1-bedroom unit with garden view.',
    client: 'Robert Johnson'
  },
  {
    id: '2',
    title: 'Family Meeting - Golden Years Home',
    date: new Date(2023, 6, 17, 14, 30),
    startTime: '2:30 PM',
    endTime: '3:30 PM',
    type: 'meeting',
    location: 'Video Conference',
    attendees: ['Maria Garcia', 'Carlos Garcia (son)', 'Elena Garcia (daughter)'],
    notes: 'Discussion about memory care options and financial considerations.',
    client: 'Maria Garcia'
  },
  {
    id: '3',
    title: 'Assessment - Serenity Care Center',
    date: new Date(2023, 6, 18, 11, 0),
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    type: 'assessment',
    location: 'Serenity Care Center, San Jose',
    attendees: ['James Williams', 'Dr. Amanda Chen'],
    notes: 'Initial care assessment to determine level of care needed.',
    client: 'James Williams'
  },
  {
    id: '4',
    title: 'Follow-up Call - Riverside Retirement',
    date: new Date(2023, 6, 20, 15, 0),
    startTime: '3:00 PM',
    endTime: '3:30 PM',
    type: 'follow-up',
    location: 'Phone Call',
    attendees: ['Dorothy Smith'],
    notes: 'Check on satisfaction with new living arrangements.',
    client: 'Dorothy Smith'
  },
];

const CalendarPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isPro = getUserTier(user) === 'premium';
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'calendar' | 'todo' | 'settings'>('calendar');
  const [isReminderSettingsOpen, setIsReminderSettingsOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'todo') {
      setActiveTab('todo');
    } else if (tab === 'settings') {
      setActiveTab('settings');
    }
  }, [location]);

  const getEventsForDate = (date: Date | undefined) => {
    if (!date) return [];
    return appointments.filter(apt => 
      apt.date.getDate() === date.getDate() &&
      apt.date.getMonth() === date.getMonth() &&
      apt.date.getFullYear() === date.getFullYear()
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const getAppointmentBadgeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'tour':
        return 'bg-blue-100 text-blue-700';
      case 'meeting':
        return 'bg-purple-100 text-purple-700';
      case 'assessment':
        return 'bg-amber-100 text-amber-700';
      case 'follow-up':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Manage your appointments, tasks, and reminders.
            {!isPro && (
              <span className="ml-2 text-healthcare-600">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="p-0 h-auto font-normal text-healthcare-600">
                      Upgrade to Pro
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Upgrade to Pro</DialogTitle>
                      <DialogDescription>
                        Unlock advanced calendar features including multi-facility synchronization, recurring appointments,
                        and integrations with popular calendar services.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <p className="font-bold text-2xl">$250<span className="text-sm font-normal">/month</span></p>
                        <p className="text-sm text-muted-foreground">Billed monthly or $2,500/year</p>
                      </div>
                      <Button>Upgrade Now</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'calendar' | 'todo' | 'settings')}>
            <TabsList>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="todo">To-Do</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </Tabs>
          {activeTab === 'calendar' && (
            <Button onClick={() => setIsAddEventOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab}>
        <TabsContent value="calendar">
          <div className="flex items-center gap-2 mb-4">
            <Tabs defaultValue="month" className="w-fit" onValueChange={(value) => setView(value as 'month' | 'week' | 'day')}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 glass-card">
              <CardHeader>
                <CardTitle>
                  {view === 'month' ? (
                    <span>Calendar {selectedDate ? `- ${format(selectedDate, 'MMMM yyyy')}` : ''}</span>
                  ) : view === 'week' ? (
                    <span>Week View</span>
                  ) : (
                    <span>Day View {selectedDate ? `- ${format(selectedDate, 'EEEE, MMMM d, yyyy')}` : ''}</span>
                  )}
                </CardTitle>
                <CardDescription>
                  Select a date to see scheduled appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border shadow p-3 pointer-events-auto"
                />
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </CardTitle>
                <CardDescription>
                  {getEventsForDate(selectedDate).length === 0 
                    ? 'No appointments scheduled' 
                    : `${getEventsForDate(selectedDate).length} appointments scheduled`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getEventsForDate(selectedDate).length === 0 ? (
                    <div className="text-center py-8 border rounded-lg">
                      <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No appointments for this date</p>
                      <Button variant="outline" className="mt-4" onClick={() => setIsAddEventOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Appointment
                      </Button>
                    </div>
                  ) : (
                    getEventsForDate(selectedDate).map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium">{appointment.title}</h4>
                          <Badge className={getAppointmentBadgeColor(appointment.type)}>
                            {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                          </Badge>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{appointment.startTime} - {appointment.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{appointment.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="h-3.5 w-3.5" />
                            <span>{appointment.client}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t flex justify-between">
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(appointment);
                            setIsReminderSettingsOpen(true);
                          }}>
                            <Bell className="h-3.5 w-3.5 mr-1" />
                            Set Reminder
                          </Button>
                          <AddToTaskButton
                            actionText={`Prepare for ${appointment.title}`}
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="glass-card mt-6">
            <CardHeader>
              <CardTitle>Upcoming Schedule</CardTitle>
              <CardDescription>Your next 7 days at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.slice(0, 4).map((appointment) => (
                  <div key={appointment.id} className="flex gap-4 p-3 border rounded-lg">
                    <div className="bg-healthcare-100 text-healthcare-700 h-12 w-12 rounded-full flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold">{format(appointment.date, 'MMM')}</span>
                      <span className="text-sm font-bold">{format(appointment.date, 'd')}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{appointment.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{appointment.startTime}</span>
                        <Badge className={getAppointmentBadgeColor(appointment.type)} variant="outline">
                          {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        <span>{appointment.client}</span>
                      </div>
                    </div>
                    <AddToTaskButton
                      actionText={`Prepare for ${appointment.title}`}
                      size="sm"
                      variant="outline"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="todo">
          <TodoList />
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-healthcare-600" />
                  Reminder Settings
                </CardTitle>
                <CardDescription>
                  Configure how you receive reminders for your appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You can set up email and SMS reminders for individual appointments from the calendar view.
                    Click on an appointment and select "Set Reminder".
                  </p>
                  
                  {isPro ? (
                    <>
                      <div className="border p-3 rounded-lg">
                        <h4 className="font-medium">Default Reminder Settings</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          These settings will apply to all new appointments unless overridden.
                        </p>
                        <ReminderSettings 
                          appointmentId="default" 
                          existingReminders={[]}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="border p-4 rounded-lg bg-muted/20 text-center">
                      <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Upgrade to Pro</h3>
                      <p className="text-muted-foreground mb-4">
                        Unlock advanced reminder features including default settings, recurring reminders,
                        and batch management.
                      </p>
                      <Button>Upgrade Now</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  External Calendar Sync
                </CardTitle>
                <CardDescription>
                  Connect to your favorite calendar services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isPro ? (
                  <CalendarSync />
                ) : (
                  <div className="border p-4 rounded-lg bg-muted/20 text-center">
                    <Link className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Upgrade to Pro</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect with Google Calendar, Outlook, and Apple Calendar
                      with our Pro subscription.
                    </p>
                    <Button>Upgrade Now</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedAppointment && (
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle>{selectedAppointment.title}</DialogTitle>
                <Badge className={getAppointmentBadgeColor(selectedAppointment.type)}>
                  {selectedAppointment.type.charAt(0).toUpperCase() + selectedAppointment.type.slice(1)}
                </Badge>
              </div>
              <DialogDescription>
                {format(selectedAppointment.date, 'EEEE, MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 my-4">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Time</span>
                </div>
                <p className="ml-6 mt-1">{selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Location</span>
                </div>
                <p className="ml-6 mt-1">{selectedAppointment.location}</p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Attendees</span>
                </div>
                <ul className="ml-6 mt-1 space-y-1">
                  {selectedAppointment.attendees.map((attendee, i) => (
                    <li key={i} className="text-sm">• {attendee}</li>
                  ))}
                </ul>
              </div>
              {selectedAppointment.notes && (
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Notes</span>
                  </div>
                  <p className="ml-6 mt-1 text-sm">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button variant="outline">Edit</Button>
              <div className="flex gap-2">
                <Button variant="destructive">Cancel Appointment</Button>
                <Button>Send Reminder</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Appointment</DialogTitle>
            <DialogDescription>
              Create a new appointment or event in your calendar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Appointment title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input 
                    id="date" 
                    value={selectedDate ? format(selectedDate, 'PP') : ''} 
                    readOnly 
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue="meeting">
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tour">Facility Tour</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start">Start Time</Label>
                <Select defaultValue="10:00">
                  <SelectTrigger id="start">
                    <SelectValue placeholder="Start time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end">End Time</Label>
                <Select defaultValue="11:00">
                  <SelectTrigger id="end">
                    <SelectValue placeholder="End time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="12:00">12:00 PM</SelectItem>
                    <SelectItem value="13:00">1:00 PM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                    <SelectItem value="17:00">5:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="robert-johnson">Robert Johnson</SelectItem>
                  <SelectItem value="maria-garcia">Maria Garcia</SelectItem>
                  <SelectItem value="james-williams">James Williams</SelectItem>
                  <SelectItem value="dorothy-smith">Dorothy Smith</SelectItem>
                  <SelectItem value="new">+ Add New Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Location of appointment" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional details..." className="min-h-[100px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddEventOpen(false)}>Save Appointment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReminderSettingsOpen} onOpenChange={setIsReminderSettingsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Set Reminders</DialogTitle>
            <DialogDescription>
              {selectedAppointment && (
                <>
                  For: {selectedAppointment.title} on {format(selectedAppointment.date, 'EEEE, MMMM d, yyyy')} at {selectedAppointment.startTime}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAppointment && (
            <ReminderSettings 
              appointmentId={selectedAppointment.id}
              existingReminders={[]}
              onSave={() => setIsReminderSettingsOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarPage;
