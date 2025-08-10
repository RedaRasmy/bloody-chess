
// export default function GameSettings() {
//   return (
//    <Card className="glass">
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Gamepad2 className="w-5 h-5 text-primary" />
//                 Game Settings
//               </CardTitle>
//               <CardDescription>Configure your gameplay experience</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {/* Board Theme */}
//               <div className="space-y-3">
//                 <label className="text-sm font-medium">Board Theme</label>
//                 <Select value={boardTheme} onValueChange={setBoardTheme}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="wooden">Wooden</SelectItem>
//                     <SelectItem value="marble">Marble</SelectItem>
//                     <SelectItem value="metal">Metal</SelectItem>
//                     <SelectItem value="glass">Glass</SelectItem>
//                     <SelectItem value="neon">Neon</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Piece Set */}
//               <div className="space-y-3">
//                 <label className="text-sm font-medium">Piece Set</label>
//                 <Select value={pieceSet} onValueChange={setPieceSet}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="classic">Classic</SelectItem>
//                     <SelectItem value="modern">Modern</SelectItem>
//                     <SelectItem value="medieval">Medieval</SelectItem>
//                     <SelectItem value="staunton">Staunton</SelectItem>
//                     <SelectItem value="3d">3D Style</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <Separator />

//               {/* Auto-promote to Queen */}
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <label className="text-sm font-medium">Auto-promote to Queen</label>
//                   <p className="text-xs text-muted-foreground">
//                     Automatically promote pawns to queens
//                   </p>
//                 </div>
//                 <Switch checked={autoQueen} onCheckedChange={setAutoQueen} />
//               </div>

//               {/* Show Move Hints */}
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <label className="text-sm font-medium">Show Legal Moves</label>
//                   <p className="text-xs text-muted-foreground">
//                     Highlight possible moves when piece is selected
//                   </p>
//                 </div>
//                 <Switch defaultChecked />
//               </div>

//               {/* Move Confirmation */}
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <label className="text-sm font-medium">Move Confirmation</label>
//                   <p className="text-xs text-muted-foreground">
//                     Confirm moves in ranked games
//                   </p>
//                 </div>
//                 <Switch />
//               </div>
//             </CardContent>
//           </Card>
//   )
// }
