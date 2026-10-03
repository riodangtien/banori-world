export type Season='summer'|'autumn'|'winter';
export type Weather='clear'|'rain'|'snow';
export type Destination='overview'|'hero'|'camp'|'falls'|'lookout'|'pine'|'meadow'|'river'|'hidden'|'wetland'|'top'|'front'|'rear'|'left'|'right'|'low'|'high';
export type Settings={season:Season;weather:Weather;night:boolean;paused:boolean;destination:Destination};
export const destinations={
 overview:{position:[46,40,55],target:[0,.5,0]},
 hero:{position:[8,14,16],target:[17,3,2]},
 camp:{position:[-6,9,18],target:[-14,.8,8]},
 falls:{position:[1,12,-3],target:[-8,2,-14]},
 lookout:{position:[24,11,-2],target:[17,5,-11]},
 pine:{position:[-10,7,-6],target:[-16,3.2,-12]},
 meadow:{position:[-10,4,8],target:[-15,.6,3]},
 river:{position:[1,7,14],target:[7,.2,5]},
 hidden:{position:[-12,8,21],target:[-19,1.3,15.5]},
 wetland:{position:[22,6,21],target:[14,.3,14]},
 top:{position:[0,80,1],target:[0,0,0]},
 front:{position:[0,30,69],target:[0,.5,0]},rear:{position:[0,30,-69],target:[0,.5,0]},
 left:{position:[-72,30,0],target:[0,.5,0]},right:{position:[72,30,0],target:[0,.5,0]},
 low:{position:[48,16,60],target:[0,1,0]},high:{position:[46,60,55],target:[0,.5,0]},
} as const;
