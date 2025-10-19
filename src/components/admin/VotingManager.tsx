"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/lib/components/ui/Card';
import { Button } from '@/lib/components/ui/Button';
import { Badge } from '@/lib/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/lib/components/ui/select';
import {
  Loader2,
  Users,
  ThumbsUp,
  ThumbsDown,
  Minus,
  TrendingUp,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

interface VotingCampaign {
  id: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'VOTING' | 'FUNDED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  fundingGoal: number;
  currentFunding: number;
  votes: {
    for: number;
    against: number;
    abstain: number;
    total: number;
  };
  votingPeriod?: {
    start: string;
    end: string;
  };
}

interface VoteRecord {
  id: string;
  userId: string;
  userName: string;
  projectId: string;
  projectName: string;
  choice: 'FOR' | 'AGAINST' | 'ABSTAIN';
  weight: number;
  createdAt: string;
}

export function VotingManager() {
  const [campaigns, setCampaigns] = useState<VotingCampaign[]>([]);
  const [voteRecords, setVoteRecords] = useState<VoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/projects?status=VOTING');
      if (res.ok) {
        const data = await res.json();
        const campaigns = data.projects?.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          status: p.status,
          fundingGoal: p.fundingGoal,
          currentFunding: p.currentFunding,
          votes: {
            for: p._count?.votesFor || 0,
            against: p._count?.votesAgainst || 0,
            abstain: p._count?.votesAbstain || 0,
            total: p._count?.votes || 0,
          },
        })) || [];
        setCampaigns(campaigns);
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVoteRecords = useCallback(async () => {
    if (!selectedCampaign) return;
    
    try {
      const res = await fetch(`/api/admin/projects/${selectedCampaign}/votes`);
      if (res.ok) {
        const data = await res.json();
        setVoteRecords(data.votes || []);
      }
    } catch (error) {
      console.error('Failed to fetch vote records:', error);
    }
  }, [selectedCampaign]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  useEffect(() => {
    fetchVoteRecords();
  }, [fetchVoteRecords]);

  const getVoteIcon = (choice: string) => {
    switch (choice) {
      case 'FOR':
        return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case 'AGAINST':
        return <ThumbsDown className="w-4 h-4 text-red-600" />;
      case 'ABSTAIN':
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getVoteColor = (choice: string) => {
    switch (choice) {
      case 'FOR':
        return 'bg-green-100 text-green-800';
      case 'AGAINST':
        return 'bg-red-100 text-red-800';
      case 'ABSTAIN':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculatePercentage = (count: number, total: number) => {
    if (!total) return 0;
    return (count / total) * 100;
  };

  if (loading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Voting Management</h2>
          <p className="text-muted-foreground">
            Manage voting campaigns and view real-time results
          </p>
        </div>
        <Button variant="outline" onClick={fetchCampaigns}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center min-h-[300px]">
            <div className="text-center text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active voting campaigns</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Voting Campaigns */}
          <div className="grid gap-4">
            {campaigns.map((campaign) => {
              const forPercentage = calculatePercentage(campaign.votes.for, campaign.votes.total);
              const againstPercentage = calculatePercentage(
                campaign.votes.against,
                campaign.votes.total
              );
              const abstainPercentage = calculatePercentage(
                campaign.votes.abstain,
                campaign.votes.total
              );

              return (
                <Card key={campaign.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5" />
                        <CardTitle>{campaign.name}</CardTitle>
                        <Badge className="bg-purple-100 text-purple-800">
                          VOTING ACTIVE
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedCampaign(campaign.id)}
                      >
                        View Votes
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{campaign.description}</p>

                    {/* Vote Statistics */}
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{campaign.votes.total}</div>
                        <div className="text-xs text-muted-foreground">Total Votes</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {campaign.votes.for}
                        </div>
                        <div className="text-xs text-muted-foreground">For ({forPercentage.toFixed(0)}%)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {campaign.votes.against}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Against ({againstPercentage.toFixed(0)}%)
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">
                          {campaign.votes.abstain}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Abstain ({abstainPercentage.toFixed(0)}%)
                        </div>
                      </div>
                    </div>

                    {/* Vote Distribution */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>For</span>
                        <span className="text-green-600">{forPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${forPercentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Against</span>
                        <span className="text-red-600">{againstPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-600 h-2 rounded-full"
                          style={{ width: `${againstPercentage}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Vote Records */}
          {selectedCampaign && voteRecords.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Vote Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {voteRecords.map((vote) => (
                    <div
                      key={vote.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getVoteIcon(vote.choice)}
                        <div>
                          <div className="font-medium">{vote.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(vote.createdAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Badge className={getVoteColor(vote.choice)}>{vote.choice}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default VotingManager;
