import { SectionOrderConfigMap } from "./config.model";
import { Ads } from "./ads.model";
export interface HomeData {
    config: SectionOrderConfigMap;
    ads: Ads[];
}