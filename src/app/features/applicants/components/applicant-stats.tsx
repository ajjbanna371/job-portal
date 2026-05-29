import { Card, CardContent } from "@/components/ui/card";
import { Bell, Bookmark, Briefcase } from "lucide-react";


export function StatsCards() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
            <Card className="bg-blue-50 border-blue-100 hover:shadow-md transition cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-foreground">589</p>
                            <p className="text-sm text-muted-foreground">Applied jobs</p>
                        </div>
                        <div className="rounded-lg bg-white p-2 shadow-sm border border-gray-100">
                            <Briefcase className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-100 hover:shadow-md transition cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-foreground">238</p>
                            <p className="text-sm text-muted-foreground">Favorite Jobs</p>
                        </div>
                        <div className="rounded-lg bg-white p-2 shadow-sm border border-gray-100">
                            <Bookmark className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-100 hover:shadow-md transition cursor-pointer">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-foreground">574</p>
                            <p className="text-sm text-muted-foreground">Job Alerts</p>
                        </div>
                        <div className="rounded-lg bg-white p-2 shadow-sm border border-gray-100">
                            <Bell className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}