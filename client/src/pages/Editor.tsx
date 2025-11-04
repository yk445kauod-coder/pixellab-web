import React, { useEffect, useRef, useState } from 'react';
import { Canvas, FabricImage, FabricText, Rect, Circle, Triangle } from 'fabric';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Type,
  Square,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Trash2,
  Copy,
  Undo2,
  Redo2,
  Image as ImageIcon,
  Maximize2,
} from 'lucide-react';

interface CanvasObject {
  id: string;
  object: any;
}

export default function Editor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const [selectedObject, setSelectedObject] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyStep, setHistoryStep] = useState(0);
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#000000');
  const [fillColor, setFillColor] = useState('#3b82f6');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [textContent, setTextContent] = useState('أضف نصاً');
  const [selectedFont, setSelectedFont] = useState('Arial');

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    fabricCanvasRef.current = fabricCanvas;

    // Handle object selection
    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0]);
    });

    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0]);
    });

    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    // Handle object modification
    fabricCanvas.on('object:modified', () => {
      saveHistory();
    });

    // Initialize history
    saveHistory();

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  // Save canvas state to history
  const saveHistory = () => {
    if (!fabricCanvasRef.current) return;
    const json = fabricCanvasRef.current.toJSON();
    setHistory((prev) => [...prev.slice(0, historyStep + 1), json]);
    setHistoryStep((prev) => prev + 1);
  };

  // Undo
  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      loadFromHistory(history[newStep]);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      loadFromHistory(history[newStep]);
    }
  };

  // Load canvas from history
  const loadFromHistory = (json: any) => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.loadFromJSON(json, () => {
      fabricCanvasRef.current?.renderAll();
    });
  };

  // Add Text
  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new FabricText(textContent, {
      left: 100,
      top: 100,
      fontSize: fontSize,
      fill: fontColor,
      fontFamily: selectedFont,
      editable: true,
    });

    fabricCanvasRef.current.add(text);
    fabricCanvasRef.current.setActiveObject(text);
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Add Rectangle
  const addRectangle = () => {
    if (!fabricCanvasRef.current) return;

    const rect = new Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
    });

    fabricCanvasRef.current.add(rect);
    fabricCanvasRef.current.setActiveObject(rect);
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Add Circle
  const addCircle = () => {
    if (!fabricCanvasRef.current) return;

    const circle = new Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
    });

    fabricCanvasRef.current.add(circle);
    fabricCanvasRef.current.setActiveObject(circle);
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Add Triangle
  const addTriangle = () => {
    if (!fabricCanvasRef.current) return;

    const triangle = new Triangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth: strokeWidth,
    });

    fabricCanvasRef.current.add(triangle);
    fabricCanvasRef.current.setActiveObject(triangle);
    fabricCanvasRef.current.renderAll();
    saveHistory();
  };

  // Add Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvasRef.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        const fabricImage = new FabricImage(imgElement, {
          left: 100,
          top: 100,
          scaleX: 0.5,
          scaleY: 0.5,
        });

        fabricCanvasRef.current?.add(fabricImage);
        fabricCanvasRef.current?.setActiveObject(fabricImage);
        fabricCanvasRef.current?.renderAll();
        saveHistory();
      };
      imgElement.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Delete selected object
  const deleteSelected = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    fabricCanvasRef.current.remove(selectedObject);
    fabricCanvasRef.current.renderAll();
    setSelectedObject(null);
    saveHistory();
  };

  // Duplicate selected object
  const duplicateSelected = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;

    selectedObject.clone((cloned: any) => {
      cloned.set({
        left: cloned.left + 10,
        top: cloned.top + 10,
      });
      fabricCanvasRef.current?.add(cloned);
      fabricCanvasRef.current?.setActiveObject(cloned);
      fabricCanvasRef.current?.renderAll();
      saveHistory();
    });
  };

  // Export Canvas as Image
  const exportAsImage = (format: 'png' | 'jpeg') => {
    if (!fabricCanvasRef.current) return;

    const dataUrl = fabricCanvasRef.current.toDataURL({
      format: format,
      quality: 1,
      multiplier: 1,
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `design.${format === 'jpeg' ? 'jpg' : format}`;
    link.click();
  };

  // Update selected object properties
  useEffect(() => {
    if (!selectedObject) return;

    if (selectedObject.type === 'text') {
      selectedObject.set({
        fontSize: fontSize,
        fill: fontColor,
        fontFamily: selectedFont,
      });
    } else {
      selectedObject.set({
        fill: fillColor,
        stroke: strokeColor,
        strokeWidth: strokeWidth,
      });
    }

    fabricCanvasRef.current?.renderAll();
  }, [fontSize, fontColor, fillColor, strokeColor, strokeWidth, selectedObject, selectedFont]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b bg-gradient-to-r from-blue-600 to-blue-500">
          <h1 className="text-2xl font-bold text-white">Pixellab Web</h1>
          <p className="text-sm text-blue-100">محرر الرسومات</p>
        </div>

        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="tools" className="flex-1 text-xs">أدوات</TabsTrigger>
            <TabsTrigger value="properties" className="flex-1 text-xs">خصائص</TabsTrigger>
          </TabsList>

          {/* Tools Tab */}
          <TabsContent value="tools" className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">النصوص</h3>
              <Input
                placeholder="أدخل النص"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="text-sm"
              />
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
              </select>
              <Input
                type="number"
                placeholder="حجم الخط"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                min="8"
                max="100"
                className="text-sm"
              />
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-12 h-10 p-1"
                  title="لون النص"
                />
                <Button onClick={addText} className="flex-1 text-sm">
                  <Type className="w-4 h-4 mr-2" />
                  إضافة نص
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-semibold text-sm">الأشكال</h3>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="w-12 h-10 p-1"
                  title="لون التعبئة"
                />
                <Input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-12 h-10 p-1"
                  title="لون الحد"
                />
                <Input
                  type="number"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  min="0"
                  max="10"
                  className="w-12 h-10 p-1 text-sm"
                  title="عرض الحد"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={addRectangle} variant="outline" size="sm">
                  <Square className="w-4 h-4 mr-1" />
                  مستطيل
                </Button>
                <Button onClick={addCircle} variant="outline" size="sm">
                  <CircleIcon className="w-4 h-4 mr-1" />
                  دائرة
                </Button>
                <Button onClick={addTriangle} variant="outline" size="sm">
                  <TriangleIcon className="w-4 h-4 mr-1" />
                  مثلث
                </Button>
                <Button variant="outline" size="sm" className="relative">
                  <ImageIcon className="w-4 h-4 mr-1" />
                  صورة
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-semibold text-sm">التحكم</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleUndo}
                  variant="outline"
                  size="sm"
                  disabled={historyStep === 0}
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleRedo}
                  variant="outline"
                  size="sm"
                  disabled={historyStep === history.length - 1}
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={duplicateSelected}
                  variant="outline"
                  size="sm"
                  disabled={!selectedObject}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  onClick={deleteSelected}
                  variant="destructive"
                  size="sm"
                  disabled={!selectedObject}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <h3 className="font-semibold text-sm">التصدير</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => exportAsImage('png')}
                  variant="default"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  PNG
                </Button>
                <Button
                  onClick={() => exportAsImage('jpeg')}
                  variant="default"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  JPG
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="p-4 space-y-3">
            {selectedObject ? (
              <Card className="p-4">
                <h3 className="font-semibold text-sm mb-3">خصائص العنصر</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-gray-600 mb-1">نوع:</label>
                    <p className="text-gray-900">{selectedObject.type}</p>
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">العرض:</label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.width * selectedObject.scaleX)}
                      onChange={(e) => {
                        selectedObject.set({
                          scaleX: Number(e.target.value) / selectedObject.width,
                        });
                        fabricCanvasRef.current?.renderAll();
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">الارتفاع:</label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.height * selectedObject.scaleY)}
                      onChange={(e) => {
                        selectedObject.set({
                          scaleY: Number(e.target.value) / selectedObject.height,
                        });
                        fabricCanvasRef.current?.renderAll();
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">الدوران:</label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.angle || 0)}
                      onChange={(e) => {
                        selectedObject.set({ angle: Number(e.target.value) });
                        fabricCanvasRef.current?.renderAll();
                      }}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-1">الشفافية:</label>
                    <Input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedObject.opacity || 1}
                      onChange={(e) => {
                        selectedObject.set({ opacity: Number(e.target.value) });
                        fabricCanvasRef.current?.renderAll();
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
              </Card>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>اختر عنصراً لعرض خصائصه</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800">محرر الرسومات</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="bg-white rounded-lg shadow-2xl">
            <canvas
              ref={canvasRef}
              className="border border-gray-300 cursor-crosshair rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
