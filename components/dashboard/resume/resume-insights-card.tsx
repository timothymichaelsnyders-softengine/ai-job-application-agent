import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  BarChart3,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  Wrench,
} from "lucide-react"

// constants for static information
const stats = [
  {
    label: "Skills",
    value: 0,
    icon: Wrench,
  },
  {
    label: "Experience",
    value: 0,
    icon: Briefcase,
  },
  {
    label: "Education",
    value: 0,
    icon: GraduationCap,
  },
  {
    label: "Projects",
    value: 0,
    icon: FolderGit2,
  },
  {
    label: "Certifications",
    value: 0,
    icon: Award,
  },
]

export function ResumeInsightsCard() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">

        <CardTitle>
          Resume Insights
        </CardTitle>

        <BarChart3 className="h-5 w-5 text-primary" />

      </CardHeader>

      <CardContent className="space-y-4">

        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">

                <Icon className="h-4 w-4 text-muted-foreground" />

                <span>
                  {item.label}
                </span>

              </div>

              <span className="font-semibold text-lg">
                {item.value}
              </span>

            </div>
          )
        })}

      </CardContent>
    </Card>
  )
}