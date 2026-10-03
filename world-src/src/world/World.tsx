import { PhotoCamera } from '../player/PhotoCamera';
import { Character } from '../player/Character';
import { Terrain } from './Terrain';
import { Props } from './Props';
import { Paths } from './Paths';
import { Vegetation } from '../vegetation/Vegetation';
import { Water } from '../water/Water';
import { CameraRig } from '../camera/CameraRig';
import { WorldLighting } from '../environment/WorldLighting';
import { Landmarks } from './Landmarks';
import { Wildlife } from '../wildlife/Wildlife';
import { NightLife } from '../environment/NightLife';
import { Diagnostics } from './Diagnostics';
import { Weather } from '../environment/Weather';
import type { Settings } from '../environment/settings';
export default function World({settings}:{settings:Settings}){return <><WorldLighting settings={settings}/><Terrain/><Paths/><Water settings={settings}/><Vegetation settings={settings}/><Props/><Landmarks settings={settings}/><Wildlife settings={settings}/><NightLife settings={settings}/><Diagnostics/><Weather settings={settings}/><Character/><CameraRig settings={settings}/><PhotoCamera/></>;}
