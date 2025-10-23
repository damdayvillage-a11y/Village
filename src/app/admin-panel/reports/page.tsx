"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Calendar,
  Filter,
  Plus,
  Save,
  Mail,
  Clock,
} from "lucide-react";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
}

const templates: ReportTemplate[] = [
  { id: "revenue", name: "Revenue Report", description: "Detailed revenue analysis", category: "Financial" },
  { id: "users", name: "User Activity Report", description: "User engagement metrics", category: "Users" },
  { id: "bookings", name: "Booking Summary", description: "Booking statistics", category: "Bookings" },
  { id: "marketplace", name: "Marketplace Performance", description: "Product sales analysis", category: "Marketplace" },
  { id: "carbon", name: "Carbon Credit Report", description: "Carbon credit tracking", category: "Environmental" },
];

export default function CustomReportBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [reportName, setReportName] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [exportFormat, setExportFormat] = useState("PDF");
  const [schedule, setSchedule] = useState("none");

  const generateReport = () => {
    console.log("Generating report...", {
      template: selectedTemplate,
      name: reportName,
      dateRange,
      format: exportFormat,
    });
  };

  const scheduleReport = () => {
    console.log("Scheduling report...", {
      template: selectedTemplate,
      schedule,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Custom Report Builder</h1>
          <p className="text-muted-foreground">
            Create and schedule custom reports
          </p>
        </div>
        <Button onClick={generateReport}>
          <Download className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="builder">
        <TabsList>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {/* Report Configuration */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Report Configuration</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template">Select Template</Label>
                <Select
                  id="template"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">Choose a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="reportName">Report Name</Label>
                <Input
                  id="reportName"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="Enter report name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="format">Export Format</Label>
                <Select
                  id="format"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="PDF">PDF</option>
                  <option value="CSV">CSV</option>
                  <option value="Excel">Excel (XLSX)</option>
                  <option value="JSON">JSON</option>
                </Select>
              </div>
            </div>
          </Card>

          {/* Filters */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Options
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <Select>
                  <option value="all">All</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select>
                  <option value="all">All Categories</option>
                  <option value="bookings">Bookings</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="users">Users</option>
                </Select>
              </div>
            </div>
          </Card>

          {/* Schedule */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Schedule Report
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="schedule">Frequency</Label>
                <Select
                  id="schedule"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                >
                  <option value="none">No Schedule (One-time)</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </Select>
              </div>

              {schedule !== "none" && (
                <>
                  <div>
                    <Label htmlFor="email">Email Delivery</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email addresses (comma-separated)"
                    />
                  </div>
                  <Button onClick={scheduleReport}>
                    <Mail className="h-4 w-4 mr-2" />
                    Schedule Report
                  </Button>
                </>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-6">
                <FileText className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {template.description}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setReportName(template.name);
                    }}
                  >
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Active Schedules</h3>
            <div className="space-y-4">
              {[
                {
                  name: "Weekly Revenue Report",
                  frequency: "Weekly",
                  nextRun: "2025-10-26",
                  format: "PDF",
                },
                {
                  name: "Monthly User Activity",
                  frequency: "Monthly",
                  nextRun: "2025-11-01",
                  format: "Excel",
                },
              ].map((report, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded"
                >
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.frequency} • Next: {report.nextRun} • Format:{" "}
                      {report.format}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
