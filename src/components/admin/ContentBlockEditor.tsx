"use client";

/**
 * Content Block Editor Component
 * WYSIWYG editor for content blocks with block-specific editing
 */

import { useState } from "react";
import { Button } from "@/lib/components/ui/Button";
import { Input } from "@/lib/components/ui/Input";
import { Label } from "@/lib/components/ui/label";
import { Textarea } from "@/lib/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { Card } from "@/lib/components/ui/Card";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image as ImageIcon,
  Code,
  Save,
  Eye,
} from "lucide-react";

export type BlockType =
  | "TEXT"
  | "IMAGE"
  | "HERO"
  | "STATS"
  | "GRID"
  | "CAROUSEL"
  | "VIDEO"
  | "TESTIMONIAL"
  | "CTA"
  | "FAQ"
  | "FORM"
  | "MAP";

interface ContentBlockEditorProps {
  blockType: BlockType;
  content: any;
  onChange: (content: any) => void;
  onSave?: () => void;
}

export function ContentBlockEditor({
  blockType,
  content,
  onChange,
  onSave,
}: ContentBlockEditorProps) {
  const [editMode, setEditMode] = useState<"visual" | "code">("visual");
  const [showPreview, setShowPreview] = useState(false);

  const handleContentChange = (field: string, value: any) => {
    onChange({ ...content, [field]: value });
  };

  // Text formatting functions
  const applyFormatting = (format: string) => {
    document.execCommand(format, false);
  };

  // Render block-specific editor
  const renderBlockEditor = () => {
    switch (blockType) {
      case "TEXT":
        return (
          <div className="space-y-4">
            <div className="border rounded-lg p-2 flex gap-2 flex-wrap bg-gray-50">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => applyFormatting("bold")}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => applyFormatting("italic")}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => applyFormatting("underline")}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <div className="border-l mx-1" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => applyFormatting("insertUnorderedList")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => applyFormatting("insertOrderedList")}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <div className="border-l mx-1" />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => applyFormatting("justifyLeft")}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => applyFormatting("justifyCenter")}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => applyFormatting("justifyRight")}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
              <div className="border-l mx-1" />
              <Button size="sm" variant="ghost">
                <Link className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditMode(editMode === "visual" ? "code" : "visual")}
              >
                <Code className="h-4 w-4" />
              </Button>
            </div>

            {editMode === "visual" ? (
              <div
                contentEditable
                className="min-h-[200px] border rounded-lg p-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                dangerouslySetInnerHTML={{ __html: content?.text || "" }}
                onBlur={(e) =>
                  handleContentChange("text", e.currentTarget.innerHTML)
                }
              />
            ) : (
              <Textarea
                value={content?.text || ""}
                onChange={(e) => handleContentChange("text", e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Enter HTML code..."
              />
            )}
          </div>
        );

      case "IMAGE":
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={content?.url || ""}
                onChange={(e) => handleContentChange("url", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={content?.alt || ""}
                onChange={(e) => handleContentChange("alt", e.target.value)}
                placeholder="Describe the image..."
              />
            </div>
            <div>
              <Label>Caption</Label>
              <Input
                value={content?.caption || ""}
                onChange={(e) => handleContentChange("caption", e.target.value)}
                placeholder="Optional caption..."
              />
            </div>
            <div>
              <Label>Alignment</Label>
              <Select
                value={content?.alignment || "center"}
                onValueChange={(value) => handleContentChange("alignment", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {content?.url && (
              <div className="border rounded-lg p-4">
                <img
                  src={content.url}
                  alt={content.alt || "Preview"}
                  className="max-w-full h-auto"
                />
              </div>
            )}
          </div>
        );

      case "HERO":
        return (
          <div className="space-y-4">
            <div>
              <Label>Background Image</Label>
              <Input
                value={content?.backgroundImage || ""}
                onChange={(e) =>
                  handleContentChange("backgroundImage", e.target.value)
                }
                placeholder="https://example.com/hero-bg.jpg"
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={content?.title || ""}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="Hero title..."
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={content?.subtitle || ""}
                onChange={(e) => handleContentChange("subtitle", e.target.value)}
                placeholder="Hero subtitle..."
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={content?.buttonText || ""}
                onChange={(e) =>
                  handleContentChange("buttonText", e.target.value)
                }
                placeholder="Learn More"
              />
            </div>
            <div>
              <Label>Button URL</Label>
              <Input
                value={content?.buttonUrl || ""}
                onChange={(e) => handleContentChange("buttonUrl", e.target.value)}
                placeholder="/about"
              />
            </div>
            <div>
              <Label>Overlay Opacity (0-1)</Label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={content?.overlayOpacity || "0.5"}
                onChange={(e) =>
                  handleContentChange("overlayOpacity", e.target.value)
                }
              />
            </div>
          </div>
        );

      case "VIDEO":
        return (
          <div className="space-y-4">
            <div>
              <Label>Video URL</Label>
              <Input
                value={content?.url || ""}
                onChange={(e) => handleContentChange("url", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Supports YouTube and Vimeo URLs
              </p>
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={content?.title || ""}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="Video title..."
              />
            </div>
            <div>
              <Label>Aspect Ratio</Label>
              <Select
                value={content?.aspectRatio || "16:9"}
                onValueChange={(value) =>
                  handleContentChange("aspectRatio", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "CTA":
        return (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={content?.text || ""}
                onChange={(e) => handleContentChange("text", e.target.value)}
                placeholder="Call to action text..."
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={content?.url || ""}
                onChange={(e) => handleContentChange("url", e.target.value)}
                placeholder="/contact"
              />
            </div>
            <div>
              <Label>Button Style</Label>
              <Select
                value={content?.style || "primary"}
                onValueChange={(value) => handleContentChange("style", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Size</Label>
              <Select
                value={content?.size || "medium"}
                onValueChange={(value) => handleContentChange("size", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "STATS":
        return (
          <div className="space-y-4">
            <div>
              <Label>Number of Stats</Label>
              <Input
                type="number"
                min="1"
                max="6"
                value={content?.stats?.length || 3}
                onChange={(e) => {
                  const count = parseInt(e.target.value);
                  const stats = Array.from({ length: count }, (_, i) =>
                    content?.stats?.[i] || { value: "", label: "" }
                  );
                  handleContentChange("stats", stats);
                }}
              />
            </div>
            {(content?.stats || [{}, {}, {}]).map((stat: any, index: number) => (
              <Card key={index} className="p-4">
                <div className="space-y-2">
                  <Label>Stat {index + 1} - Value</Label>
                  <Input
                    value={stat.value || ""}
                    onChange={(e) => {
                      const newStats = [...(content?.stats || [])];
                      newStats[index] = {
                        ...newStats[index],
                        value: e.target.value,
                      };
                      handleContentChange("stats", newStats);
                    }}
                    placeholder="100+"
                  />
                  <Label>Stat {index + 1} - Label</Label>
                  <Input
                    value={stat.label || ""}
                    onChange={(e) => {
                      const newStats = [...(content?.stats || [])];
                      newStats[index] = {
                        ...newStats[index],
                        label: e.target.value,
                      };
                      handleContentChange("stats", newStats);
                    }}
                    placeholder="Happy Customers"
                  />
                </div>
              </Card>
            ))}
          </div>
        );

      default:
        return (
          <div>
            <Label>Content (JSON)</Label>
            <Textarea
              value={JSON.stringify(content, null, 2)}
              onChange={(e) => {
                try {
                  onChange(JSON.parse(e.target.value));
                } catch {
                  // Invalid JSON, ignore
                }
              }}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Edit {blockType} Block</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? "Hide" : "Show"} Preview
          </Button>
          {onSave && (
            <Button size="sm" onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
        </div>
      </div>

      {renderBlockEditor()}

      {showPreview && (
        <Card className="p-4 bg-gray-50">
          <div className="text-sm font-medium mb-2">Preview</div>
          <div className="bg-white p-4 rounded border">
            {/* Render preview based on block type */}
            {blockType === "TEXT" && (
              <div dangerouslySetInnerHTML={{ __html: content?.text || "" }} />
            )}
            {blockType === "IMAGE" && content?.url && (
              <div className={`flex justify-${content.alignment || "center"}`}>
                <div>
                  <img
                    src={content.url}
                    alt={content.alt}
                    className="max-w-full h-auto"
                  />
                  {content.caption && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {content.caption}
                    </p>
                  )}
                </div>
              </div>
            )}
            {blockType === "HERO" && (
              <div className="relative h-64 rounded-lg overflow-hidden">
                {content?.backgroundImage && (
                  <img
                    src={content.backgroundImage}
                    alt="Hero background"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0 bg-black"
                  style={{ opacity: content?.overlayOpacity || 0.5 }}
                />
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
                  <h1 className="text-4xl font-bold mb-4">{content?.title}</h1>
                  <p className="text-xl mb-6">{content?.subtitle}</p>
                  {content?.buttonText && (
                    <button className="bg-white text-black px-6 py-2 rounded-lg">
                      {content.buttonText}
                    </button>
                  )}
                </div>
              </div>
            )}
            {blockType === "CTA" && (
              <div className="flex justify-center">
                <button
                  className={`px-6 py-2 rounded-lg ${
                    content?.style === "primary"
                      ? "bg-blue-600 text-white"
                      : content?.style === "secondary"
                      ? "bg-gray-600 text-white"
                      : content?.style === "outline"
                      ? "border-2 border-blue-600 text-blue-600"
                      : "text-blue-600"
                  } ${
                    content?.size === "large"
                      ? "text-lg px-8 py-3"
                      : content?.size === "small"
                      ? "text-sm px-4 py-1"
                      : ""
                  }`}
                >
                  {content?.text || "Button"}
                </button>
              </div>
            )}
            {blockType === "STATS" && (
              <div className="grid grid-cols-3 gap-8 text-center">
                {(content?.stats || []).map((stat: any, i: number) => (
                  <div key={i}>
                    <div className="text-4xl font-bold text-blue-600">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 mt-2">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
