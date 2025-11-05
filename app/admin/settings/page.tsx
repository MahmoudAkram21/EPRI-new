'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Settings, 
  DollarSign, 
  Globe, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Building,
  Save
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface SystemSettings {
  // General
  siteName: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  
  // Payment
  currency: string;
  currencySymbol: string;
  paymentMethods: string;
  
  // Contact
  contactEmail: string;
  contactPhone: string;
  
  // Social Media
  facebook: string;
  twitter: string;
  linkedin: string;
  
  // Bank Details
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankAddress: string;
}

export default function AdminSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    siteName: 'Egyptian Petroleum Research Institute',
    siteEmail: 'info@epri.edu',
    sitePhone: '+20 2 1234 5678',
    siteAddress: '1 Ahmed El-Zomor Street, Nasr City, Cairo, Egypt',
    currency: 'EGP',
    currencySymbol: 'EGP',
    paymentMethods: 'Bank Transfer, Cash, Online Payment',
    contactEmail: 'contact@epri.edu',
    contactPhone: '+20 2 1234 5678',
    facebook: 'https://facebook.com/epri',
    twitter: 'https://twitter.com/epri',
    linkedin: 'https://linkedin.com/company/epri',
    bankName: 'National Bank of Egypt',
    accountNumber: '1234567890',
    accountName: 'Egyptian Petroleum Research Institute',
    bankAddress: 'Bank Branch Address, Cairo, Egypt'
  });

  const handleChange = (field: keyof SystemSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Settings saved successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">Manage your website settings and preferences</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic information about your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input 
                  id="siteName" 
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="siteEmail">Site Email</Label>
                <Input 
                  id="siteEmail" 
                  type="email"
                  value={settings.siteEmail}
                  onChange={(e) => handleChange('siteEmail', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="sitePhone">Site Phone</Label>
                <Input 
                  id="sitePhone"
                  value={settings.sitePhone}
                  onChange={(e) => handleChange('sitePhone', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="siteAddress">Site Address</Label>
                <Textarea 
                  id="siteAddress"
                  value={settings.siteAddress}
                  onChange={(e) => handleChange('siteAddress', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Settings
              </CardTitle>
              <CardDescription>Configure payment methods and currency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={settings.currency}
                    onValueChange={(value) => handleChange('currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EGP">Egyptian Pound (EGP)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="currencySymbol">Currency Symbol</Label>
                  <Input 
                    id="currencySymbol"
                    value={settings.currencySymbol}
                    onChange={(e) => handleChange('currencySymbol', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="paymentMethods">Accepted Payment Methods</Label>
                <Input 
                  id="paymentMethods"
                  value={settings.paymentMethods}
                  onChange={(e) => handleChange('paymentMethods', e.target.value)}
                  placeholder="Bank Transfer, Cash, Online Payment"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Contact details for inquiries and support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail" 
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input 
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>Links to your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input 
                  id="facebook"
                  value={settings.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input 
                  id="twitter"
                  value={settings.twitter}
                  onChange={(e) => handleChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input 
                  id="linkedin"
                  value={settings.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Bank Details
              </CardTitle>
              <CardDescription>Bank account information for payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input 
                  id="bankName"
                  value={settings.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input 
                  id="accountName"
                  value={settings.accountName}
                  onChange={(e) => handleChange('accountName', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber"
                  value={settings.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bankAddress">Bank Address</Label>
                <Textarea 
                  id="bankAddress"
                  value={settings.bankAddress}
                  onChange={(e) => handleChange('bankAddress', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save All Settings'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
