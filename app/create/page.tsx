"use client";
import { Button } from '@/components/ui/button';
import { get } from 'http';
import React from 'react';
import CopySnippet from 'react-copy-snippet';
import { ClipLoader } from 'react-spinners';
import { ORCHESTRATOR_URL } from '@/lib/utils';

const Page = () => {
    const [data, setData] = React.useState<any>(null);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [sources, setSources] = React.useState<any>([]);
    async function getClassRooms(first: boolean = false) {
        if(first)setLoading(true);
        const sources_req = await fetch(`${ORCHESTRATOR_URL}/classroom/get/all`);
        const sources = await sources_req.json();
        setSources(sources.data);
        if(first)setLoading(false);
    }
    React.useEffect(() => {
        getClassRooms(true);
        let interval = setInterval(async()=>getClassRooms(), 10000);
        return () => clearInterval(interval);
    }, [])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setData(null);
        const formData = Object.fromEntries(new FormData(e.target as HTMLFormElement));
        console.log(formData);
        setLoading(true);
        const res = await fetch(`${ORCHESTRATOR_URL}/class/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const response = await res.json();
        setLoading(false);
        setData(response.data);
        console.log(response);
    };
    const handleStopLive = async () => {
        const res = await fetch(`${ORCHESTRATOR_URL}/api/v1/video/live/stop/${data.streamKey}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const response = await res.json();
        console.log(response);
        if (response.error) {
            alert(response.msg);
        } else {
            alert("Live Stream Stopped");
            window.location.reload();
        }
    }
    return (
        <div className="max-w-[50%] mx-auto mt-10 p-6 bg-white opacity-80 filter backdrop-blur-lg rounded-lg shadow-lg">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-5 rounded shadow-lg">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Loading <ClipLoader size={20} />
                        </h1>
                    </div>
                </div>
            )}
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Create A Live Stream</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                        type="text"
                        id="title"
                        className="w-full bg-gray-100 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name='title'
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                        id="description"
                        className="w-full px-3 py-2 border bg-gray-100 border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        name='description'
                        rows={3}
                        required
                    ></textarea>
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Source</label>
                    <select name="classroom_id" id="source" className="w-full bg-gray-100 px-3 py-2 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {
                            sources.map((source: any, index: number) => (
                                <option key={index} value={source.id}>{source.name} ({source.online ? 'Online' : 'Offline'})</option>
                            ))
                        }
                    </select>
                </div>
                <div className="text-right">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Create Class
                    </button>
                </div>
            </form>
            {
                data && (
                    <div className="mt-10">
                        <h1 className="text-2xl font-bold mb-6 text-gray-800">Live Stream Created</h1>
                        <div className="flex flex-row gap-4 items-center">
                            <p>Class Key: <code className='font-mono text-sm flex-1 select-all'>{data.id}</code></p>
                            <CopySnippet text={data.id} />
                        </div>
                        <div className="flex flex-row gap-4 items-center justify-center">
                            {/* Stop Live Stream Button */}
                            <Button variant="destructive" className="text-muted-foreground text-white" onClick={handleStopLive}>
                                Stop Stream
                            </Button>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default Page;
