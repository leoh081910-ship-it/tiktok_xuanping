import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, TrendingUp, Package, Lightbulb, Trash2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: Record<string, unknown>;
  sales: Record<string, unknown>;
  growth: Record<string, unknown>;
  images: string[];
  countries: string[];
  data_source: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  products?: Product[];
}

interface QuickAction {
  label: string;
  prompt: string;
  icon: React.ReactNode;
}

const quickActions: QuickAction[] = [
  {
    label: '推荐高潜力商品',
    prompt: '根据当前数据，推荐 10 个最值得做的商品，要求高增长、低竞争、利润率好',
    icon: <TrendingUp className="h-4 w-4" />,
  },
  {
    label: '分析泰国市场',
    prompt: '分析泰国 TikTok 市场的热门趋势，告诉我现在什么类目最火',
    icon: <Package className="h-4 w-4" />,
  },
  {
    label: '选品建议',
    prompt: '我想做东南亚市场的小商品生意（预算1-2万），有什么具体的选品建议吗？',
    icon: <Lightbulb className="h-4 w-4" />,
  },
];

const STORAGE_KEY = 'deepseek-chat-messages';

export function DeepSeekAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 从 localStorage 加载聊天记录
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // 恢复 Date 对象
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  }, []);

  // 保存聊天记录到 localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save chat history:', error);
      }
    }
  }, [messages]);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://cqsqedvhhnyhwxakujyf.supabase.co";
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxc3FlZHZoaG55aHd4YWt1anlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjM5NjEsImV4cCI6MjA4NTY5OTk2MX0.4xJbf6fTBqsd4xagMcUuibW7XAeT-vf5UZWXAXvyhds";

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 发送消息到 DeepSeek
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // 调用 Edge Function
      const response = await fetch(`${supabaseUrl}/functions/v1/deepseek-chatbot`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // 先尝试普通 JSON 响应（更可靠）
      let data;
      let contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        // 普通 JSON 响应
        data = await response.json();
        console.log('收到 JSON 响应:', data);

        const assistantMessage: Message = {
          role: 'assistant',
          content: data.content || '抱歉，我遇到了一些问题。',
          timestamp: new Date(),
          products: data.products,
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // 流式响应（暂未启用）
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantContent = '';
        let assistantProducts: Product[] = [];

        if (reader) {
          // 创建一个临时助手消息
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: '',
            timestamp: new Date(),
          }]);

          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);

                  if (parsed.content) {
                    assistantContent += parsed.content;
                    setIsTyping(false);

                    // 更新最后一条消息的内容
                    setMessages(prev => {
                      const newMessages = [...prev];
                      const lastMessage = newMessages[newMessages.length - 1];
                      if (lastMessage?.role === 'assistant') {
                        lastMessage.content = assistantContent;
                      }
                      return newMessages;
                    });
                  }

                  if (parsed.products) {
                    assistantProducts = parsed.products;
                    setMessages(prev => {
                      const newMessages = [...prev];
                      const lastMessage = newMessages[newMessages.length - 1];
                      if (lastMessage?.role === 'assistant') {
                        lastMessage.products = assistantProducts;
                      }
                      return newMessages;
                    });
                  }
                } catch (e) {
                  console.error('Error parsing SSE:', e);
                }
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);

      // 添加错误消息
      const errorMessage: Message = {
        role: 'assistant',
        content: `抱歉，我遇到了一些问题：${(error as Error).message}\n\n请检查：\n1. DeepSeek API 是否已配置\n2. 网络连接是否正常\n3. 稍后重试`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);

      toast.error('发送消息失败', {
        description: (error as Error).message,
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  // 清空对话
  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('对话已清空');
  };

  return (
    <>
      {/* 悬浮按钮 */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* 聊天窗口 */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-50 w-[400px] h-[650px] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-lg font-bold">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold text-base">DeepSeek 选品助手</h3>
                <p className="text-xs text-white/80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  在线 - 基于 DeepSeek AI
                </p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-white hover:bg-white/20 text-xs font-medium"
                onClick={clearConversation}
                title="清空对话"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                清空
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
                title="关闭窗口"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <h4 className="font-semibold mb-2">嗨！我是你的选品助手</h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    我可以帮你分析商品、推荐选品、洞察市场趋势
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">试试问我：</p>
                    {quickActions.map((action, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-left h-auto py-2 px-3"
                        onClick={() => sendMessage(action.prompt)}
                      >
                        <span className="mr-2">{action.icon}</span>
                        <span className="text-sm">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted border'
                    }`}
                  >
                    {/* 消息内容 */}
                    <div className="p-3">
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>

                      {/* 商品卡片 */}
                      {msg.products && msg.products.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {msg.products.slice(0, 3).map((product) => {
                            const price = product.price as Record<string, unknown>;
                            const sales = product.sales as Record<string, unknown>;
                            const growth = product.growth as Record<string, unknown>;

                            return (
                              <div
                                key={product.id}
                                className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700"
                              >
                                <div className="flex items-start gap-3">
                                  {product.images && product.images.length > 0 && (
                                    <img
                                      src={product.images[0]}
                                      alt={product.name}
                                      className="w-16 h-16 rounded object-cover"
                                    />
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                                      {product.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        ${Number(price?.value || 0).toFixed(2)}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        销量 {Number(sales?.monthly || 0)}
                                      </span>
                                      {growth?.rate && (
                                                                <Badge
                                                                  className={`text-xs ${
                                                                    growth.trend === 'up' ? 'bg-green-600' : 'bg-gray-600'
                                                                  }`}
                                                                >
                                                                  {growth.rate > 0 ? '+' : ''}{growth.rate}%
                                                                </Badge>
                                                              )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {msg.products.length > 3 && (
                            <p className="text-xs text-muted-foreground text-center pt-2">
                              还有 {msg.products.length - 3} 个商品...
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 时间戳 */}
                    <div className={`px-3 pb-2 text-xs ${
                      msg.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                    }`}>
                      {msg.timestamp.toLocaleTimeString('zh-CN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {/* 输入中提示 */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted border rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t bg-background">
            {messages.length > 0 && (
              <div className="flex justify-end mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={clearConversation}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  清空对话
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder="问我任何关于选品的问题..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by DeepSeek AI • 数据实时更新
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
