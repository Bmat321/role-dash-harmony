
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Upload, Download, Eye, Share2, Lock, Trash2, Search, Filter, Plus, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  type: string;
  category: 'personal' | 'policy' | 'contract' | 'handbook' | 'form' | 'certificate';
  size: string;
  uploadedBy: string;
  uploadedDate: string;
  access: 'public' | 'private' | 'restricted';
  version: string;
  tags: string[];
  employeeId?: string;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: string[];
}

const DocumentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const { toast } = useToast();

  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Employee Handbook 2024',
      type: 'PDF',
      category: 'handbook',
      size: '2.5 MB',
      uploadedBy: 'HR Team',
      uploadedDate: '2024-01-15',
      access: 'public',
      version: 'v2.1',
      tags: ['handbook', 'policies', '2024']
    },
    {
      id: '2',
      name: 'John Doe - Employment Contract',
      type: 'PDF',
      category: 'contract',
      size: '1.2 MB',
      uploadedBy: 'Sarah Johnson',
      uploadedDate: '2024-12-01',
      access: 'restricted',
      version: 'v1.0',
      tags: ['contract', 'employment'],
      employeeId: '4'
    },
    {
      id: '3',
      name: 'Remote Work Policy',
      type: 'DOCX',
      category: 'policy',
      size: '850 KB',
      uploadedBy: 'Admin',
      uploadedDate: '2024-11-20',
      access: 'public',
      version: 'v1.3',
      tags: ['policy', 'remote', 'work']
    },
    {
      id: '4',
      name: 'Performance Review Form',
      type: 'PDF',
      category: 'form',
      size: '450 KB',
      uploadedBy: 'HR Team',
      uploadedDate: '2024-10-15',
      access: 'public',
      version: 'v2.0',
      tags: ['form', 'performance', 'review']
    }
  ];

  const mockTemplates: DocumentTemplate[] = [
    {
      id: '1',
      name: 'Employment Contract',
      description: 'Standard employment agreement template',
      category: 'Legal',
      fields: ['Employee Name', 'Position', 'Start Date', 'Salary', 'Department']
    },
    {
      id: '2',
      name: 'Leave Request Form',
      description: 'Employee leave application form',
      category: 'HR',
      fields: ['Employee Name', 'Leave Type', 'Start Date', 'End Date', 'Reason']
    },
    {
      id: '3',
      name: 'Performance Review',
      description: 'Annual performance evaluation form',
      category: 'Performance',
      fields: ['Employee Name', 'Review Period', 'Goals', 'Achievements', 'Rating']
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'bg-blue-100 text-blue-800';
      case 'policy': return 'bg-green-100 text-green-800';
      case 'contract': return 'bg-purple-100 text-purple-800';
      case 'handbook': return 'bg-orange-100 text-orange-800';
      case 'form': return 'bg-yellow-100 text-yellow-800';
      case 'certificate': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessColor = (access: string) => {
    switch (access) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'private': return 'bg-red-100 text-red-800';
      case 'restricted': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      toast({
        title: "Files Uploaded",
        description: `Successfully uploaded ${files.length} file(s)`,
      });
      setIsUploadOpen(false);
    }
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Document Management</h2>
          <p className="text-gray-600">Organize, store, and manage all employee documents</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Document</DialogTitle>
                <DialogDescription>
                  Upload a new document to the system
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
                    onChange={handleFileUpload}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="handbook">Handbook</SelectItem>
                      <SelectItem value="form">Form</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="access">Access Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Library</CardTitle>
              <CardDescription>Search and manage all documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="handbook">Handbook</SelectItem>
                    <SelectItem value="form">Form</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{doc.name}</h4>
                          <Badge className={getCategoryColor(doc.category)}>
                            {doc.category}
                          </Badge>
                          <Badge className={getAccessColor(doc.access)}>
                            {doc.access}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-2">
                          <span>{doc.type}</span>
                          <span>•</span>
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>v{doc.version}</span>
                          <span>•</span>
                          <span>by {doc.uploadedBy}</span>
                          <span>•</span>
                          <span>{new Date(doc.uploadedDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      {doc.access === 'private' && (
                        <Button variant="outline" size="sm">
                          <Lock className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>Pre-built templates for common documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTemplates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Fields:</h5>
                      <div className="flex flex-wrap gap-1">
                        {template.fields.map((field) => (
                          <Badge key={field} variant="secondary" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Use
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Policies</CardTitle>
              <CardDescription>Manage and distribute company policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Code of Conduct</h4>
                      <p className="text-sm text-gray-600">Guidelines for professional behavior and ethics</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>Last updated: Dec 1, 2024</span>
                    <span>Version: 3.2</span>
                    <span>Compliance: 95%</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Distribute
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Review
                    </Button>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Data Privacy Policy</h4>
                      <p className="text-sm text-gray-600">Data handling and privacy protection guidelines</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Review Due</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span>Last updated: Sep 15, 2024</span>
                    <span>Version: 2.1</span>
                    <span>Compliance: 87%</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Distribute
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Review
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-gray-500">+23 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.4 GB</div>
                <p className="text-xs text-gray-500">of 50 GB limit</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Access Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-gray-500">This week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Policy Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">92%</div>
                <p className="text-xs text-gray-500">Average rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DocumentManagement;
