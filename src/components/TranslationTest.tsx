import React, { useState, useEffect, useCallback } from 'react';
import { translateToEnglish, translateFromEnglish, translateBetweenLanguages, detectLanguage, SUPPORTED_LANGUAGES } from '../services/translation/googleTranslate';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2, Copy, Check, History, Volume2, VolumeX, Sun, Moon, Keyboard } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence, useAnimate } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TranslationHistory {
  from: string;
  to: string;
  input: string;
  output: string;
  timestamp: number;
}

const TranslationTest: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLang, setDetectedLang] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromLanguage, setFromLanguage] = useState('auto');
  const [toLanguage, setToLanguage] = useState('en');
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [history, setHistory] = useState<TranslationHistory[]>([]);
  const [activeTab, setActiveTab] = useState('translate');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [scope, animate] = useAnimate();

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('translationHistory', JSON.stringify(history));
  }, [history]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger if not in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Ctrl/Cmd + Enter to translate
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleTranslate();
      }
      // Ctrl/Cmd + S to swap languages
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        handleSwapLanguages();
      }
      // Ctrl/Cmd + C to copy translation
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && translatedText) {
        handleCopy();
      }
      // Ctrl/Cmd + H to toggle history
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        setActiveTab(prev => prev === 'translate' ? 'history' : 'translate');
      }
      // Ctrl/Cmd + K to show shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        setShowShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [translatedText]);

  const handleTranslate = async () => {
    if (!inputText) {
      toast({
        title: "Input Required",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Animate the translate button
      await animate(scope.current, { scale: [1, 0.95, 1] }, { duration: 0.2 });
      
      // Detect language if auto is selected
      let sourceLang = fromLanguage;
      if (sourceLang === 'auto') {
        sourceLang = await detectLanguage(inputText);
        setDetectedLang(sourceLang);
      }
      
      // Translate text
      let translated;
      if (sourceLang === 'en') {
        translated = await translateFromEnglish(inputText, toLanguage);
      } else if (toLanguage === 'en') {
        translated = await translateToEnglish(inputText, sourceLang);
      } else {
        translated = await translateBetweenLanguages(inputText, sourceLang, toLanguage);
      }
      
      setTranslatedText(translated);

      // Add to history with animation
      const newHistoryItem: TranslationHistory = {
        from: sourceLang,
        to: toLanguage,
        input: inputText,
        output: translated,
        timestamp: Date.now(),
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Translation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      setError(errorMessage);
      toast({
        title: "Translation Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLanguages = () => {
    if (fromLanguage === 'auto') return;
    setFromLanguage(toLanguage);
    setToLanguage(fromLanguage);
    // Animate the swap button
    animate(scope.current, { rotate: 180 }, { duration: 0.3 });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setIsCopied(true);
      // Animate the copy button
      await animate(scope.current, { scale: [1, 1.2, 1] }, { duration: 0.2 });
      toast({
        title: "Copied!",
        description: "Translation copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy translation",
        variant: "destructive",
      });
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    } else {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = toLanguage;
      window.speechSynthesis.speak(utterance);
    }
    setIsSpeaking(!isSpeaking);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('translationHistory');
    toast({
      title: "History Cleared",
      description: "Translation history has been cleared",
    });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Card className="w-[400px] relative" ref={scope}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Translation Test</CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleTheme}
                  className="h-8 w-8"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
            <DialogTrigger asChild>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Keyboard className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Keyboard shortcuts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Keyboard Shortcuts</DialogTitle>
                <DialogDescription>
                  Here are all the available keyboard shortcuts
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Ctrl/Cmd + Enter</span>
                  <span className="col-span-3">Translate text</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Ctrl/Cmd + S</span>
                  <span className="col-span-3">Swap languages</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Ctrl/Cmd + C</span>
                  <span className="col-span-3">Copy translation</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Ctrl/Cmd + H</span>
                  <span className="col-span-3">Toggle history</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="font-medium">Ctrl/Cmd + K</span>
                  <span className="col-span-3">Show shortcuts</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="translate">Translate</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="translate" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <Label>From Language:</Label>
              <Select value={fromLanguage} onValueChange={setFromLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-2"
            >
              <Label>Input Text:</Label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
                rows={3}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex items-center justify-between"
            >
              <Button
                onClick={handleTranslate}
                disabled={isLoading || !inputText}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  'Translate'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleSwapLanguages}
                disabled={fromLanguage === 'auto' || isLoading}
                className="ml-2"
              >
                ⇄
              </Button>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {detectedLang && fromLanguage === 'auto' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert>
                    <AlertTitle>Detected Language</AlertTitle>
                    <AlertDescription>
                      {SUPPORTED_LANGUAGES[detectedLang as keyof typeof SUPPORTED_LANGUAGES] || detectedLang}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {translatedText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Label>Translation:</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopy}
                        className="h-8 w-8"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSpeak}
                        className="h-8 w-8"
                      >
                        {isSpeaking ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-md">
                    {translatedText}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="space-y-2"
            >
              <Label>To Language:</Label>
              <Select value={toLanguage} onValueChange={setToLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
                    <SelectItem key={code} value={code}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-center"
            >
              <h3 className="text-lg font-medium">Translation History</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={clearHistory}
                disabled={history.length === 0}
              >
                Clear History
              </Button>
            </motion.div>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {history.map((item, index) => (
                  <motion.div
                    key={item.timestamp}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-muted rounded-lg space-y-2"
                  >
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>
                        {SUPPORTED_LANGUAGES[item.from as keyof typeof SUPPORTED_LANGUAGES] || item.from} →
                        {SUPPORTED_LANGUAGES[item.to as keyof typeof SUPPORTED_LANGUAGES] || item.to}
                      </span>
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">{item.input}</p>
                      <p className="text-sm font-medium">{item.output}</p>
                    </div>
                  </motion.div>
                ))}
                {history.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground py-8"
                  >
                    No translation history yet
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TranslationTest; 