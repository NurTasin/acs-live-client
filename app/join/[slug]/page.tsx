"use client";
import { MediaPlayer, MediaProvider, SeekButton } from '@vidstack/react';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import {
    DefaultAudioLayout,
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { SeekBackward10Icon, SeekForward10Icon } from "@vidstack/react/icons";
import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { ClipLoader } from 'react-spinners';
import { ORCHESTRATOR_URL } from '@/lib/utils';

export default function Home({ params }: { params: { slug: string } }) {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    console.log(params.slug);
    const handleLoad = (loadingAnimation: boolean = true) => {
        ; (async () => {
            if(loadingAnimation){
                setLoading(true);
            }
            const res = await fetch(`${ORCHESTRATOR_URL}/class/resolve/${params.slug}`, {
                next: {
                    tags: ["VIDEO_DATA"]
                }
            });
            const data = await res.json();
            console.log(data.data);
            setData(data.data);
            if(loadingAnimation){
                setLoading(false);
            }
        })();
    }
    React.useEffect(() => {
        handleLoad();
    }, []);
    return (
        <>
            <Card className="w-full max-w-2xl mx-auto min-h-[calc(100vh-55px)] bg-gray-200">
                <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    {loading || !data ? (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-5 rounded shadow-lg">
                                <h1 className="text-2xl font-bold flex items-center gap-2">
                                    Loading <ClipLoader size={20} />
                                </h1>
                            </div>
                        </div>
                    ) : data ? (
                        <MediaPlayer
                            title={data.title}
                            src={`${data.stream_url}/hls/stream.m3u8`}
                            viewType='video'
                            streamType='live'
                            logLevel='warn'
                            crossOrigin
                            playsInline
                            onHlsError={(e) => {
                                console.log(e);
                                if (e.type === "mediaError" || e.type === "networkError"){
                                    handleLoad(false);
                                }
                            }}
                        >
                            <MediaProvider>
                                <SeekButton seconds={-10}>
                                    <SeekBackward10Icon />
                                </SeekButton>

                                <SeekButton seconds={10}>
                                    <SeekForward10Icon />
                                </SeekButton>
                            </MediaProvider>
                            <DefaultAudioLayout icons={defaultLayoutIcons} />
                            <DefaultVideoLayout icons={defaultLayoutIcons} />
                        </MediaPlayer>
                    ) : data && data.status === "DISCONNECTED" ? (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <h1 className="text-2xl font-bold">Stream Disconnected</h1>
                            <p className="text-muted-foreground">
                                The stream has been disconnected
                            </p>
                        </div>
                    ) : data && data.status === "STOPPED" ? (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <h1 className="text-2xl font-bold">Stream Ended</h1>
                            <p className="text-muted-foreground">
                                The stream has been ended.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <h1 className="text-2xl font-bold">Stream Not Found</h1>
                            <p className="text-muted-foreground">
                                The stream does not exist.
                            </p>
                        </div>
                    )
                    }

                </div>
                <CardContent className="p-6 space-y-4">
                    {
                        data && (
                            <div className="space-y-2">
                                <h3 className="text-2xl font-semibold">{data.title}</h3>
                                <p className="text-muted-foreground">
                                    {data.description}
                                </p>
                            </div>
                        )
                    }
                </CardContent>
            </Card>
        </>
    );
}
