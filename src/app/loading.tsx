"use client";

import Skeleton, {SkeletonTheme} from "react-loading-skeleton";

export default function Home() {

    return (
        <SkeletonTheme baseColor={"#ffffff"} enableAnimation={true} highlightColor={"darkgray"}>
            <div>
                <div className="flex flex-row mb-4">
                    <div className="w-1/3 pr-4">
                        <Skeleton height={100}/>
                    </div>
                    <div className="w-1/3 pr-4">
                        <Skeleton height={100}/>
                    </div>
                    <div className="w-1/3">
                        <Skeleton height={100}/>
                    </div>
                </div>

                <Skeleton count={2} height={200}/>
            </div>
        </SkeletonTheme>

    )
}