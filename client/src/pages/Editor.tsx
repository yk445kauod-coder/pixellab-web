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
  Menu,
  X,
} from 'lucide-react';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#ffffff',
    });

    fabricCanvasRef.current = fabricCanvas;

    fabricCanvas.on('selection:created', (e) => {
      setSelectedObject(e.selected?.[0]);
    });

    fabricCanvas.on('selection:updated', (e) => {
      setSelectedObject(e.selected?.[0]);
    });

    fabricCanvas.on('selection:cleared', () => {
      setSelectedObject(null);
    });

    fabricCanvas.on('object:modified', () => {
      saveHistory();
    });

    saveHistory();

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        fabricCanvas.setWidth(window.innerWidth - 20);
        fabricCanvas.setHeight(window.innerHeight - 200);
      }
      fabricCanvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      fabricCanvas.dispose();
    };
  }, [canvasSize]);

  const saveHistory = () => {
    if (!fabricCanvasRef.current) return;
    const json = fabricCanvasRef.current.toJSON();
    setHistory((prev) => [...prev.slice(0, historyStep + 1), json]);
    setHistoryStep((prev) => prev + 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      loadFromHistory(history[newStep]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      loadFromHistory(history[newStep]);
    }
  };

  const loadFromHistory = (json: any) => {
    if (!fabricCanvasRef.current) return;
    fabricCanvasRef.current.loadFromJSON(json, () => {
      fabricCanvasRef.current?.renderAll();
    });
  };

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

  const deleteSelected = () => {
    if (!fabricCanvasRef.current || !selectedObject) return;
    fabricCanvasRef.current.remove(selectedObject);
    fabricCanvasRef.current.renderAll();
    setSelectedObject(null);
    saveHistory();
  };

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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Sidebar */}
      <div
        className={`glass-lg fixed md:relative z-40 h-screen overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 md:w-64'
        } md:w-64`}
      >
        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-blue-600 to-purple-600">
          <h1 className="text-2xl font-bold text-white">Pixellab Web</h1>
          <p className="text-sm text-blue-100">محرر الرسومات</p>
        </div>

        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="w-full rounded-none border-b border-white/20 bg-transparent">
            <TabsTrigger value="tools" className="flex-1 text-xs">أدوات</TabsTrigger>
            <TabsTrigger value="properties" className="flex-1 text-xs">خصائص</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="p-4 space-y-3">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">النصوص</h3>
              <Input
                placeholder="أدخل النص"
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="text-sm glass-sm border-white/20"
              />
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="w-full px-2 py-1 border border-white/20 rounded text-sm glass-sm"
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
                className="text-sm glass-sm border-white/20"
              />
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={fontColor}
                  onChange={(e) => setFontColor(e.target.value)}
                  className="w-12 h-10 p-1 glass-sm border-white/20"
                />
                <Button onClick={addText} className="flex-1 text-sm bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-smooth">
                  <Type className="w-4 h-4 mr-2" />
                  إضافة نص
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/20">
              <h3 className="font-semibold text-sm">الأشكال</h3>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={fillColor}
                  onChange={(e) => setFillColor(e.target.value)}
                  className="w-12 h-10 p-1 glass-sm border-white/20"
                />
                <Input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="w-12 h-10 p-1 glass-sm border-white/20"
                />
                <Input
                  type="number"
                  value={strokeWidth}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  min="0"
                  max="10"
                  className="w-12 h-10 p-1 text-sm glass-sm border-white/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={addRectangle} variant="outline" size="sm" className="glass-sm border-white/20 hover:bg-white/20 transition-smooth">
                  <Square className="w-4 h-4 mr-1" />
                  مستطيل
                </Button>
                <Button onClick={addCircle} variant="outline" size="sm" className="glass-sm border-white/20 hover:bg-white/20 transition-smooth">
                  <CircleIcon className="w-4 h-4 mr-1" />
                  دائرة
                </Button>
                <Button onClick={addTriangle} variant="outline" size="sm" className="glass-sm border-white/20 hover:bg-white/20 transition-smooth">
                  <TriangleIcon className="w-4 h-4 mr-1" />
                  مثلث
                </Button>
                <Button variant="outline" size="sm" className="relative glass-sm border-white/20 hover:bg-white/20 transition-smooth">
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

            <div className="space-y-2 pt-4 border-t border-white/20">
              <h3 className="font-semibold text-sm">التحكم</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleUndo}
                  variant="outline"
                  size="sm"
                  disabled={historyStep === 0}
                  className="glass-sm border-white/20 hover:bg-white/20 transition-smooth disabled:opacity-50"
                >
                  <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleRedo}
                  variant="outline"
                  size="sm"
                  disabled={historyStep === history.length - 1}
                  className="glass-sm border-white/20 hover:bg-white/20 transition-smooth disabled:opacity-50"
                >
                  <Redo2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={duplicateSelected}
                  variant="outline"
                  size="sm"
                  disabled={!selectedObject}
                  className="glass-sm border-white/20 hover:bg-white/20 transition-smooth disabled:opacity-50"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  onClick={deleteSelected}
                  variant="destructive"
                  size="sm"
                  disabled={!selectedObject}
                  className="transition-smooth disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/20">
              <h3 className="font-semibold text-sm">التصدير</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => exportAsImage('png')}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-smooth text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  PNG
                </Button>
                <Button
                  onClick={() => exportAsImage('jpeg')}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 transition-smooth text-sm"
                >
                  <Download className="w-4 h-4 mr-1" />
                  JPG
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="p-4 space-y-3">
            {selectedObject ? (
              <Card className="p-4 glass-sm border-white/20">
                <h3 className="font-semibold text-sm mb-3">خصائص العنصر</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <label className="block text-gray-600 dark:text-gray-300 mb-1">نوع:</label>
                    <p className="text-gray-900 dark:text-gray-100">{selectedObject.type}</p>
                  </div>
                  <div>
                    <label className="block text-gray-600 dark:text-gray-300 mb-1">العرض:</label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.width * selectedObject.scaleX)}
                      onChange={(e) => {
                        selectedObject.set({
                          scaleX: Number(e.target.value) / selectedObject.width,
                        });
                        fabricCanvasRef.current?.renderAll();
                      }}
                      className="text-sm glass-sm border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 dark:text-gray-300 mb-1">الارتفاع:</label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.height * selectedObject.scaleY)}
                      onChange={(e) => {
                        selectedObject.set({
                          scaleY: Number(e.target.value) / selectedObject.height,
                        });
                        fabricCanvasRef.current?.renderAll();
                      }}
                      className="text-sm glass-sm border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 dark:text-gray-300 mb-1">الدوران:</label>
                    <Input
                      type="number"
                      value={Math.round(selectedObject.angle || 0)}
                      onChange={(e) => {
                        selectedObject.set({ angle: Number(e.target.value) });
                        fabricCanvasRef.current?.renderAll();
                      }}
                      className="text-sm glass-sm border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 dark:text-gray-300 mb-1">الشفافية:</label>
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

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Toolbar */}
        <div className="glass-lg border-b border-white/20 px-4 py-3 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              size="sm"
              className="md:hidden"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              محرر الرسومات
            </h2>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center p-2 md:p-4 overflow-auto">
          <div className="glass-lg rounded-2xl shadow-2xl p-4 md:p-6">
            <canvas
              ref={canvasRef}
              className="border-2 border-white/30 rounded-lg cursor-crosshair transition-smooth"
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
