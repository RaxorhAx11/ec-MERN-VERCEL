import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  MessageSquare,
  Mail,
  Phone,
  Clock,
  HelpCircle,
  BookOpen,
  FileText,
  Video,
  Download,
  ExternalLink,
  Send,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Settings,
  CreditCard,
  Truck,
  Package,
  Users,
  BarChart3,
  Shield,
  Zap
} from "lucide-react";

function AdminSupport() {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    priority: 'medium',
    category: 'general',
    message: ''
  });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Support Request Submitted",
      description: "We'll get back to you within 24 hours",
    });

    // Reset form
    setContactForm({
      name: '',
      email: '',
      subject: '',
      priority: 'medium',
      category: 'general',
      message: ''
    });
  };

  const handleInputChange = (field, value) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Support resources data
  const quickHelpItems = [
    {
      title: "Getting Started",
      description: "Learn the basics of managing your e-commerce store",
      icon: BookOpen,
      color: "text-primary",
      bgColor: "bg-primary/10",
      link: "#"
    },
    {
      title: "Product Management",
      description: "Add, edit, and organize your product catalog",
      icon: Package,
      color: "text-success",
      bgColor: "bg-success/10",
      link: "#"
    },
    {
      title: "Order Processing",
      description: "Handle customer orders and fulfillment",
      icon: Truck,
      color: "text-info",
      bgColor: "bg-info/10",
      link: "#"
    },
    {
      title: "Payment Setup",
      description: "Configure PayPal and payment methods",
      icon: CreditCard,
      color: "text-warning",
      bgColor: "bg-warning/10",
      link: "#"
    },
    {
      title: "Analytics & Reports",
      description: "Understand your business performance",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      link: "#"
    },
    {
      title: "User Management",
      description: "Manage customer accounts and permissions",
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
      link: "#"
    }
  ];

  const faqItems = [
    {
      question: "How do I add a new product?",
      answer: "Go to Products → Add Product, fill in the details, upload an image, and save. Make sure to set proper pricing and stock levels.",
      category: "Products"
    },
    {
      question: "How do I process an order?",
      answer: "Navigate to Orders → View Orders, find the order, and update its status (pending → inProcess → delivered).",
      category: "Orders"
    },
    {
      question: "How do I set up PayPal payments?",
      answer: "Configure your PayPal credentials in the environment variables. See the PayPal setup guide for detailed instructions.",
      category: "Payments"
    },
    {
      question: "How do I upload product images?",
      answer: "Use the image upload component in the product form. Images are automatically uploaded to Cloudinary and optimized.",
      category: "Media"
    },
    {
      question: "How do I view analytics?",
      answer: "Visit the Analytics page to see comprehensive reports on sales, orders, products, and customer insights.",
      category: "Analytics"
    },
    {
      question: "How do I manage customer accounts?",
      answer: "Customer management is handled through the authentication system. Users can register, login, and manage their profiles.",
      category: "Users"
    }
  ];

  const documentationItems = [
    {
      title: "Admin Panel Guide",
      description: "Complete guide to using the admin panel",
      type: "PDF",
      size: "2.4 MB",
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    {
      title: "API Documentation",
      description: "REST API endpoints and usage examples",
      type: "HTML",
      size: "1.8 MB",
      icon: ExternalLink,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      type: "MP4",
      size: "45 MB",
      icon: Video,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Environment Setup",
      description: "Configuration guide for all services",
      type: "PDF",
      size: "1.2 MB",
      icon: Settings,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const supportStats = [
    {
      title: "Response Time",
      value: "< 24 hours",
      icon: Clock,
      color: "text-success"
    },
    {
      title: "Support Tickets",
      value: "0 open",
      icon: MessageSquare,
      color: "text-primary"
    },
    {
      title: "Knowledge Base",
      value: "50+ articles",
      icon: BookOpen,
      color: "text-info"
    },
    {
      title: "Satisfaction Rate",
      value: "98%",
      icon: CheckCircle,
      color: "text-success"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground">Get help, documentation, and contact our support team</p>
        </div>
        <Badge className="admin-badge success">
          <CheckCircle className="w-3 h-3 mr-1" />
          Support Available
        </Badge>
      </div>

      {/* Support Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {supportStats.map((stat, index) => (
          <Card key={index} className="admin-stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="admin-stat-label">{stat.title}</p>
                <p className="admin-stat-value">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Support Tabs */}
      <Tabs defaultValue="contact" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="help">Quick Help</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contact Form */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Support Request
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                        className="admin-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        className="admin-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Brief description of your issue"
                      className="admin-input"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={contactForm.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger className="admin-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={contactForm.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger className="admin-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Describe your issue or question in detail..."
                      className="admin-input min-h-[120px]"
                    />
                  </div>

                  <Button type="submit" className="admin-button primary w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Send Support Request
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@walkup.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-muted-foreground">+91 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM IST</p>
                    </div>
                  </div>

                  <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                      <div>
                        <p className="font-medium text-warning">Emergency Support</p>
                        <p className="text-sm text-muted-foreground">
                          For critical issues affecting your store, contact us immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="help" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quickHelpItems.map((item, index) => (
              <Card key={index} className="admin-card hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bgColor}`}>
                      <item.icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                      <Button variant="outline" size="sm" className="admin-button outline">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <div className="grid gap-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="admin-card">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{item.question}</h3>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {documentationItems.map((doc, index) => (
              <Card key={index} className="admin-card hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${doc.bgColor}`}>
                      <doc.icon className={`w-6 h-6 ${doc.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{doc.size}</span>
                        </div>
                        <Button variant="outline" size="sm" className="admin-button outline">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Resources */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Video Tutorials</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Watch step-by-step video guides for common tasks
                  </p>
                  <Button variant="outline" size="sm" className="admin-button outline">
                    <Video className="w-3 h-3 mr-1" />
                    Watch Videos
                  </Button>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Community Forum</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Connect with other users and get community support
                  </p>
                  <Button variant="outline" size="sm" className="admin-button outline">
                    <Users className="w-3 h-3 mr-1" />
                    Join Forum
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminSupport;
