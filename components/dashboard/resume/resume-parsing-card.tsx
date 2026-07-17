import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

import {
  BrainCircuit,
  CheckCircle2,
} from "lucide-react"

export function ResumeParsingCard() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Resume Parsing
        </CardTitle>

        <BrainCircuit className="h-5 w-5 text-primary" />
      </CardHeader>

      <CardContent className="space-y-6">

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Status
          </span>

          <Badge className="gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Last Parsed
          </span>

          <span className="font-medium">
            Today
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            AI Model
          </span>

          <span className="font-medium">
            Gemini 2.5 Flash
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Processing
          </span>

          <span className="font-medium text-green-600">
            Ready
          </span>
        </div>

      </CardContent>
    </Card>
  )
}
