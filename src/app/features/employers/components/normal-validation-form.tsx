// // * ------------------------- * ----------------------------- * //

// // Note this is our normal Setting Form validation page start

// // * ------------------------- * ----------------------------- * //

// "use client";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Briefcase,
//   Building2,
//   Calendar,
//   FileText,
//   Globe,
//   MapPin,
//   Users,
// } from "lucide-react";
// import { Controller, useForm } from "react-hook-form";
// import { updateEmployerProfileAction } from "../../auth/server/employer.action";
// import { toast } from "sonner";

// interface InputFieldData {
//   username: string;
//   email: string;
//   name: string;
//   description: string;
//   yearOfEstablishment: string;
//   location: string;
//   websiteUrl: string;
//   organizationType: organizationType;
//   teamSize: teamSize;
// }

// // * -------------------- * -------------------- * //

// const organizationTypesOptions = ["development", "business", "design"] as const;
// type organizationType = (typeof organizationTypesOptions)[number];

// // without as const, typeScript thinks options is just a generic list of strings (string[]). With as const, TypeScript treats it as a Read-Only Tuple. Its knows exactly that:

// // Index 0 is "development"

// // Index 1 is "business"

// // Index 2 is "design"

// // Nothing else is allowed

// // * -------------------- * -------------------- * //

// // * -------------------- * -------------------- * //

// const teamSizeOptions = ["1-5", "6-20", "21-50"] as const;
// type teamSize = (typeof teamSizeOptions)[number];
// // * -------------------- * -------------------- * //

// const EmployerSettingsForm = () => {
//   const { register, handleSubmit, control } = useForm<InputFieldData>();

//   const handleFormSubmit = async (data: InputFieldData) => {
//     console.log("form data:", data);

//     const response = await updateEmployerProfileAction(data);
//     if(response.status === "SUCCESS") {
//         toast.success(response.message);
//     } else {
//         toast.error(response.message)
//     }
//   };

//   return (
//     <Card className="w-2/4">
//       <CardContent>
//         <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
//           {/* <div className="grid w-full max-w-sm items-center gap-3">
//             <Label htmlFor="username">username</Label>
//             <Input id="username" type="text" {...register("username")} />
//           </div>

//           <div className="grid w-full max-w-sm items-center gap-3">
//             <Label htmlFor="email">Email</Label>
//             <Input id="email" type="text" {...register("email")} />
//           </div> */}

//           {/* Company Name */}
//           <div className="space-y-2">
//             <Label htmlFor="companyName">Company Name *</Label>
//             <div className="relative">
//               <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 id="companyName"
//                 type="text"
//                 placeholder="Enter company name"
//                 className="pl-10"
//                 {...register("name")}
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div className="space-y-2">
//             <Label htmlFor="companyName">Company Description</Label>
//             <div className="relative">
//               <FileText className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
//               <Textarea
//                 id="description"
//                 placeholder="Tell us about your company, what you do, and your mission..."
//                 className="pl-10 min-h-[120px] resize-none"
//                 {...register("description")}
//               />
//             </div>
//           </div>

//           {/* Organization Type */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="yearOfEstablishment">
//                 Organization Type *
//               </Label>
//               <Controller
//                 name="organizationType"
//                 control={control}
//                 render={({ field }) => (
//                   <div className="relative">
//                     <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                     <Select value={field.value} onValueChange={field.onChange}>
//                       <SelectTrigger className="pl-10 w-full">
//                         <SelectValue placeholder="Select Organization type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {organizationTypesOptions.map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {/* {capitalizeWords(type)} */}
//                             {type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//               />
//             </div>

//             {/* Team Size */}
//             <div className="space-y-2">
//               <Label htmlFor="yearOfEstablishment">
//                 Team size *
//               </Label>
//               <Controller
//                 name="teamSize"
//                 control={control}
//                 render={({ field }) => (
//                   <div className="relative">
//                     <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                     <Select value={field.value} onValueChange={field.onChange}>
//                       <SelectTrigger className="pl-10 w-full">
//                         <SelectValue placeholder="Select Team Size" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {teamSizeOptions.map((type) => (
//                           <SelectItem key={type} value={type}>
//                             {/* {capitalizeWords(type)} */}
//                             {type}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 )}
//               />
//             </div>
//           </div>
//            {/* 
//           Since the Shadcn component doesn't speak "Native HTML", react-hook-form doesn't know how to talk to it. The Controller acts as a Translator (or an Adapter).

//           No Ref: you cannot attach a ref to a <div> and expect RHF to extract a value from it. A <div> doesn't have a .value property.

//           No Native Events: Since it's not a real input, it doesn't trigger a standard change event that react-hook-form (RHF) Listening for. IT triggers a custom React event (usually called onvalueChange).
//           */}


//           {/* Year of Establishment and Location - two columns */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="space-y-2">
//               <Label htmlFor="yearOfEstablishment">
//                 Year Of Establishment *
//               </Label>
//               <div className="relative">
//                 <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   id="yearOfEstablishment"
//                   type="text"
//                   placeholder="e.g., 2020"
//                   maxLength={4}
//                   className="pl-10"
//                   {...register("yearOfEstablishment")}
//                 />
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="location">Location *</Label>
//               <div className="relative">
//                 <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 <Input
//                   id="location"
//                   type="text"
//                   placeholder="e.g., Pune, Bangalore"
//                   className="pl-10"
//                   {...register("location")}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Website URL */}
//           <div className="space-y-2">
//             <Label htmlFor="websiteUrl">Website URL (optional)</Label>
//             <div className="relative">
//               <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//               <Input
//                 id="websiteUrl"
//                 type="text"
//                 placeholder="https://www.yourcompany.com"
//                 className="pl-10"
//                 {...register("websiteUrl")}
//               />
//             </div>
//           </div>

//           <Button type="submit">Save Changes</Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// };

// export default EmployerSettingsForm;

// // * ------------------------- * ----------------------------- * //

// // Note this is our normal Setting Form validation page end 

// // * ------------------------- * ----------------------------- * //



