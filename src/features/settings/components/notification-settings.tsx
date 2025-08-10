// import React from 'react'

// export default function NotificationSettings() {
//   return (
//     <Card className="glass">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Bell className="w-5 h-5 text-primary" />
//                 Notifications
//               </CardTitle>
//               <CardDescription>Manage your notification preferences</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Push Notifications */}
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <label className="text-sm font-medium">Push Notifications</label>
//                   <p className="text-xs text-muted-foreground">
//                     Receive browser notifications
//                   </p>
//                 </div>
//                 <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
//               </div>

//               {notificationsEnabled && (
//                 <>
//                   <Separator />

//                   {/* Game Invites */}
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <label className="text-sm font-medium">Game Invitations</label>
//                       <p className="text-xs text-muted-foreground">
//                         When someone challenges you
//                       </p>
//                     </div>
//                     <Switch defaultChecked />
//                   </div>

//                   {/* Turn Notifications */}
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <label className="text-sm font-medium">Your Turn</label>
//                       <p className="text-xs text-muted-foreground">
//                         When it's your move in correspondence
//                       </p>
//                     </div>
//                     <Switch defaultChecked />
//                   </div>

//                   {/* Tournament Notifications */}
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <label className="text-sm font-medium">Tournament Updates</label>
//                       <p className="text-xs text-muted-foreground">
//                         Tournament starts and results
//                       </p>
//                     </div>
//                     <Switch />
//                   </div>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//   )
// }
