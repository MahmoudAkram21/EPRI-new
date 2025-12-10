import { departments } from "@/lib/data"
import { PageContainer } from "@/components/page-container"
import { Section } from "@/components/section"
import { AnimatedSection } from "@/components/animated-section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Microscope } from "lucide-react"
import EquipmentCard from "@/components/equipment-card"

export default function EquipmentsPage() {
  // Collect all equipment from all departments
  const allEquipment = departments.flatMap((dept) =>
    dept.equipment.map((eq) => ({
      ...eq,
      department: dept.name,
      departmentId: dept.id,
    })),
  )

  return (
    <PageContainer>
      {/* Hero Section with Background */}
      <Section className="relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed" 
          style={{ 
            backgroundImage: `url('/petroleum-lab-testing.jpg')`,
            transform: 'scale(1.05)',
            filter: 'brightness(0.6) contrast(1.1) saturate(1.2)'
          }}
        ></div>
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/85 via-emerald-600/75 to-teal-600/85"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/40 via-transparent to-cyan-500/40"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-1/3 w-3 h-3 bg-green-400/60 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-32 left-1/3 w-5 h-5 bg-blue-400/60 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 right-1/4 w-2 h-2 bg-cyan-400/60 rounded-full animate-bounce delay-500"></div>
        
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection animation="fade-up">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                  <Microscope className="h-16 w-16 text-white" />
                </div>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent leading-tight">
                Scientific Equipments
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-light">
                Explore our state-of-the-art scientific equipment and analytical instruments used in petroleum research and
                analysis across all our laboratories.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section>
        <AnimatedSection animation="fade-up">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{allEquipment.length}</div>
                <div className="text-sm text-muted-foreground">Total Equipment</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">{departments.length}</div>
                <div className="text-sm text-muted-foreground">Laboratories</div>
              </CardContent>
            </Card>
            <Card className="col-span-2 md:col-span-1">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {departments.reduce((sum, dept) => sum + dept.analysisServices.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Analysis Services</div>
              </CardContent>
            </Card>
          </div>
        </AnimatedSection>
      </Section>

      {/* Equipment by Department */}
      {departments.map((department, deptIndex) => (
        <Section key={department.id} >
          <AnimatedSection animation="fade-up">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{department.icon}</div>
                <div>
                  <h2 className="font-serif text-3xl font-bold">{department.name}</h2>
                  <p className="text-muted-foreground">{department.equipment.length} Equipment Available</p>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {department.equipment.map((equipment, index) => (
              <AnimatedSection key={equipment.id} animation="fade-up" delay={index * 0.1}>
                <EquipmentCard equipment={equipment} department={department.name} departmentId={department.id} />
              </AnimatedSection>
            ))}
          </div>
        </Section>
      ))}
    </PageContainer>
  )
}

