import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarIcon, RefreshCwIcon, CheckCircleIcon, XCircleIcon, FileTextIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  idNumber: z.string().min(10, "T.C. Kimlik No veya Öğrenci No en az 10 karakter olmalıdır"),
  graduationDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Tarih formatı: AA/GG/YYYY"),
  diplomaNumber: z.string().min(1, "Diploma numarası gereklidir"),
  securityCode: z.string().min(1, "Güvenlik kodu gereklidir")
});

interface VerificationResult {
  status: 'success' | 'error' | 'not_found';
  data?: {
    studentName: string;
    graduationPeriod: string;
    graduationDate: string;
    gpa: string;
    faculty: string;
    department: string;
    program: string;
    graduationNameFirst: string;
    graduationNameLast: string;
    diplomaIssueDate: string;
    diplomaPrintDate: string;
    verificationDateTime: string;
  };
  message: string;
}

const generateInitialCaptcha = () => {
  const num1 = Math.floor(Math.random() * 41) + 10;
  const num2 = Math.floor(Math.random() * 41) + 10;
  return {
    question: `${num1} + ${num2}`,
    answer: (num1 + num2).toString()
  };
};

const DiplomaQueryForm = () => {
  const initialCaptcha = generateInitialCaptcha();
  const [captchaQuestion, setCaptchaQuestion] = useState(initialCaptcha.question);
  const [captchaAnswer, setCaptchaAnswer] = useState(initialCaptcha.answer);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idNumber: "",
      graduationDate: "",
      diplomaNumber: "",
      securityCode: ""
    }
  });

  const generateNewCaptcha = () => {
    // Generate two random numbers between 10-50
    const num1 = Math.floor(Math.random() * 41) + 10;
    const num2 = Math.floor(Math.random() * 41) + 10;
    const newQuestion = `${num1} + ${num2}`;
    const newAnswer = (num1 + num2).toString();
    
    setCaptchaQuestion(newQuestion);
    setCaptchaAnswer(newAnswer);
    
    toast({
      title: "Yeni güvenlik kodu",
      description: `Yeni güvenlik kodu oluşturuldu: ${newQuestion} = ?`
    });
  };

  const simulateVerification = async (data: z.infer<typeof formSchema>): Promise<VerificationResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate verification logic
    if (data.securityCode !== captchaAnswer) {
      return {
        status: 'error',
        message: 'Güvenlik kodu yanlış. Lütfen tekrar deneyin.'
      };
    }

    // Mock successful verification
    if (data.idNumber === "9963635438" && data.graduationDate === "04/07/2025" && data.diplomaNumber === "2025/04802") {
      return {
        status: 'success',
        data: {
          studentName: "AHMED MOHAMED AHMED",
          graduationPeriod: "2024-2025 Bahar",
          graduationDate: "04/07/2025",
          gpa: "3,29",
          faculty: "MÜHENDİSLİK FAKÜLTESİ",
          department: "MAKİNE MÜHENDİSLİĞİ",
          program: "Makine Mühendisliği (%30 İng.) (II)",
          graduationNameFirst: "AHMED MOHAMED",
          graduationNameLast: "AHMED",
          diplomaIssueDate: "09.07.2025",
          diplomaPrintDate: "09.07.2025",
          verificationDateTime: new Date().toLocaleString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        },
        message: 'Diploma başarıyla doğrulandı.'
      };
    }

    return {
      status: 'not_found',
      message: 'Girilen bilgilere ait diploma bulunamadı. Lütfen bilgilerinizi kontrol edin.'
    };
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setVerificationResult(null);

    try {
      const result = await simulateVerification(data);
      setVerificationResult(result);
      
      if (result.status === 'success') {
        toast({
          title: "Başarılı",
          description: result.message,
        });
      } else {
        toast({
          title: "Hata",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Hata",
        description: "Bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-university-header text-white py-4 px-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => {
                toast({
                  title: "'/olbs' Uygulamasında Sunucu Hatası.",
                  description: "Kaynak bulunamadı.\n\nAçıklama: HTTP 404. Aradığınız kaynak (veya bağımlı olduklarından biri) kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamaz durumda olabilir. Lütfen aşağıdaki URL'yi gözden geçirin ve doğru yazıldığından emin olun.\n\nİstenen URL: /olbs/ext_doc_query/index_new.aspx",
                  variant: "destructive"
                });
              }}
            >
              <img 
                src="/karabuk-logo.png" 
                alt="Karabük Üniversitesi Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-xl font-semibold">Karabük Üniversitesi</h1>
          </div>
          <div className="text-lg">Diploma Sorgulama</div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src="/diploma-icon.png" 
              alt="Diploma Icon" 
              className="w-12 h-12 object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="bg-university-form border-0 shadow-lg">
            <div className="bg-university-header text-white py-3 px-6 rounded-t-lg">
              <h2 className="text-center font-medium">Diploma Sorgulama İşlemleri</h2>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="p-8 space-y-6">
                {/* ID Number Field */}
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>T.C. Kimlik No veya Öğrenci No</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="T.C. Kimlik No veya Öğrenci No giriniz" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Graduation Date Field */}
                <FormField
                  control={form.control}
                  name="graduationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mezuniyet Tarihi</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            placeholder="mm/dd/yyyy" 
                            {...field} 
                            className="pr-10"
                          />
                        </FormControl>
                        <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Diploma Number Field */}
                <FormField
                  control={form.control}
                  name="diplomaNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diploma Numarası</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Diploma numaranızı giriniz" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Security Code Field */}
                <FormField
                  control={form.control}
                  name="securityCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Güvenlik Kodu</FormLabel>
                      <div className="flex gap-4 items-center">
                        <FormControl>
                          <Input 
                            placeholder="Güvenlik kodunu giriniz" 
                            {...field} 
                            className="flex-1"
                          />
                        </FormControl>
                        <div className="flex items-center gap-2">
                          <div className="bg-muted border px-4 py-2 text-foreground font-mono text-lg tracking-wider min-w-[120px] text-center rounded">
                            {captchaQuestion} = ?
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={generateNewCaptcha}
                            className="h-10 w-10"
                          >
                            <RefreshCwIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-university-header hover:bg-university-header/90 text-white px-8 py-2"
                  >
                    {isLoading ? "Sorgulanıyor..." : "Giriş"}
                  </Button>
                </div>
              </form>
            </Form>
          </Card>

          {/* Verification Results */}
          {verificationResult && (
            <Card className="bg-university-form border-0 shadow-lg animate-slide-in">
              {verificationResult.status === 'success' ? (
                <>
                  <div className="bg-success text-success-foreground py-3 px-6 rounded-t-lg">
                    <h3 className="text-center font-medium">
                      Sorgulama Sonucu ({verificationResult.data?.verificationDateTime} tarih ve saat itibariyle)
                    </h3>
                  </div>
                  
                  <div className="p-6 bg-card">
                    {verificationResult.data && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-3 text-sm">
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="font-medium text-muted-foreground">Adı Soyadı:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.studentName}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="font-medium text-muted-foreground">Mezuniyet Dönemi:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.graduationPeriod}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="font-medium text-muted-foreground">Mezuniyet Tarihi:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.graduationDate}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="font-medium text-muted-foreground">Mezuniyet Ortalaması:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.gpa}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="font-medium text-muted-foreground">Mezun Olduğu Birim:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.faculty}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="font-medium text-muted-foreground">Mezun Olduğu Bölüm:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.department}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="font-medium text-muted-foreground">Mezun Olduğu Program:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.program}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="font-medium text-muted-foreground">Mezuniyet Tarihindeki Adı:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.graduationNameFirst}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="font-medium text-muted-foreground">Mezuniyet Tarihindeki Soyadı:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.graduationNameLast}</span>
                          </div>
                          <div className="flex justify-between py-2 border-b border-border">
                            <span className="font-medium text-muted-foreground">Diploma Düzenleme Tarihi:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.diplomaIssueDate}</span>
                          </div>
                          <div className="flex justify-between py-2">
                            <span className="font-medium text-muted-foreground">Diploma Basım Tarihi:</span>
                            <span className="font-semibold text-foreground">{verificationResult.data.diplomaPrintDate}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-destructive text-destructive-foreground py-3 px-6 rounded-t-lg">
                    <div className="flex items-center justify-center gap-2">
                      <XCircleIcon className="h-5 w-5" />
                      <h3 className="font-medium">Doğrulama Hatası</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-center text-muted-foreground">
                      {verificationResult.message}
                    </p>
                  </div>
                </>
              )}
            </Card>
          )}

          {/* Language Link */}
          <div className="text-center">
            <button className="text-blue-600 hover:text-blue-800 underline">
              English
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DiplomaQueryForm;