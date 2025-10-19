"use client";

import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Flag, Search, Loader2, Save, ToggleLeft, ToggleRight } from "lucide-react";

type FeatureCategory = "CORE" | "EXPERIMENTAL" | "BETA" | "DEPRECATED";
type FeatureStatus = "ENABLED" | "DISABLED" | "STAGED";

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  category: FeatureCategory;
  status: FeatureStatus;
  enabled: boolean;
  rolloutPercentage: number;
  userTargeting: string[];
  dependencies: string[];
}

export default function FeatureFlagsPage() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [features, setFeatures] = useState<FeatureFlag[]>([
    {
      id: "1",
      name: "new_dashboard",
      description: "New analytics dashboard with enhanced visualizations",
      category: "BETA",
      status: "STAGED",
      enabled: true,
      rolloutPercentage: 50,
      userTargeting: ["admin", "beta_tester"],
      dependencies: ["analytics_api"],
    },
    {
      id: "2",
      name: "ai_recommendations",
      description: "AI-powered product recommendations",
      category: "EXPERIMENTAL",
      status: "DISABLED",
      enabled: false,
      rolloutPercentage: 0,
      userTargeting: [],
      dependencies: ["ml_api"],
    },
    {
      id: "3",
      name: "advanced_search",
      description: "Advanced search with filters and facets",
      category: "CORE",
      status: "ENABLED",
      enabled: true,
      rolloutPercentage: 100,
      userTargeting: [],
      dependencies: [],
    },
  ]);

  const handleToggleFeature = useCallback((featureId: string) => {
    setFeatures((prev) =>
      prev.map((f) =>
        f.id === featureId ? { ...f, enabled: !f.enabled } : f
      )
    );
  }, []);

  const handleRolloutChange = useCallback(
    (featureId: string, percentage: number) => {
      setFeatures((prev) =>
        prev.map((f) =>
          f.id === featureId ? { ...f, rolloutPercentage: percentage } : f
        )
      );
    },
    []
  );

  const handleSave = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) throw new Error("Failed to save");
      alert("Feature flags saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      alert("Failed to save feature flags");
    } finally {
      setLoading(false);
    }
  }, [features]);

  const filteredFeatures = features.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Flag className="h-8 w-8" />
            Feature Flags
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage feature rollouts and A/B testing
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredFeatures.map((feature) => (
          <Card key={feature.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{feature.name}</h3>
                  <Badge
                    variant={
                      feature.category === "CORE"
                        ? "default"
                        : feature.category === "BETA"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {feature.category}
                  </Badge>
                  <Badge
                    variant={feature.enabled ? "default" : "secondary"}
                  >
                    {feature.enabled ? "ENABLED" : "DISABLED"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleFeature(feature.id)}
              >
                {feature.enabled ? (
                  <ToggleRight className="h-6 w-6 text-green-600" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </Button>
            </div>

            {feature.enabled && (
              <div className="space-y-4 mt-4 pt-4 border-t">
                <div>
                  <Label>Rollout Percentage: {feature.rolloutPercentage}%</Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={feature.rolloutPercentage}
                    onChange={(e) =>
                      handleRolloutChange(feature.id, parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                {feature.userTargeting.length > 0 && (
                  <div>
                    <Label className="text-sm">User Targeting</Label>
                    <div className="flex gap-2 mt-1">
                      {feature.userTargeting.map((role) => (
                        <Badge key={role} variant="outline">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
