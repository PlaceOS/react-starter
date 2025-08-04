import { getModule, PlaceSystem, showSystem } from '@placeos/ts-client';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { lastValueFrom } from 'rxjs';

let sub_list: (() => void)[] = [];

function SystemPage() {
    const navigate = useNavigate();
    const { system_id } = useParams();
    const [loading, setLoading] = useState(true); // 'Checks', 'search', 'Setup', or ''
    const [system, setSystem] = useState<PlaceSystem | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);

    const togglePower = async (state: boolean) => {
        if (!system) return;
        const mod = getModule(system.id, 'System');
        if (!mod) return;
        mod.execute('power', [state]);
    };

    const clearSubs = () => {
        console.log('Subs:', sub_list);
        sub_list.forEach((sub) => sub && sub());
        sub_list = [];
    };

    useEffect(() => {
        setLoading(true);
        if (!system_id) {
            navigate('/');
            return;
        }
        const bindToSystem = (system: PlaceSystem) => {
            clearSubs();
            const mod = getModule(system.id, 'System');
            if (!mod) return;
            const conn_bind = mod.binding('connected');
            const conn_sub = conn_bind
                .listen()
                .subscribe((state) => setConnected(state));
            sub_list.push(() => conn_sub.unsubscribe());
            sub_list.push(conn_bind.bind());
            const active_bind = mod.binding('active');
            const active_sub = active_bind
                .listen()
                .subscribe((state) => setActive(state));
            sub_list.push(() => active_sub.unsubscribe());
            sub_list.push(active_bind.bind());
        };
        lastValueFrom(showSystem(system_id)).then((system) => {
            setSystem(system);
            bindToSystem(system);
            setLoading(false);
        });
        return () => clearSubs();
    }, [navigate]);

    return (
        <div className="absolute inset-0 p-8 flex items-center flex-col">
            <div className="rounded bg-white border border-gray-300 shadow text-black min-w-[24rem]">
                <h3 className="text-2xl font-medium px-4 py-2 w-full border-b border-gray-300">
                    {system?.display_name || system?.name || 'Loading...'}
                    {loading ? (
                        <span className="opacity-30 text-xs font-mono px-2 py-1 rounded bg-base-300">
                            Loading...
                        </span>
                    ) : null}
                </h3>
                <div className="px-2 pt-2">
                    <p className="rounded bg-gray-100 p-2">
                        {system?.description ? (
                            system.description
                        ) : (
                            <span className="opacity-30">
                                No description available
                            </span>
                        )}
                    </p>
                </div>
                <div className="p-1"></div>
                <div className="px-4 py-2 flex items-center space-x-2">
                    {connected ? (
                        <div className="h-4 w-4 rounded-full bg-green-600 shadow"></div>
                    ) : (
                        <div className="h-4 w-4 rounded-full bg-red-600 shadow"></div>
                    )}
                    <div>{connected ? 'Connected' : 'Disconnected'}</div>
                </div>
                <div className="px-4 py-2 flex items-center space-x-2">
                    {active ? (
                        <div className="h-4 w-4 rounded-full bg-green-600 shadow"></div>
                    ) : (
                        <div className="h-4 w-4 rounded-full bg-red-600 shadow"></div>
                    )}
                    <div>{active ? 'Powered On' : 'Powered Off'}</div>
                </div>
                <div className="px-4 py-2 mt-2 flex justify-end border-t border-gray-300">
                    <button
                        className="btn"
                        onClick={() => togglePower(!active)}
                    >
                        {active ? 'Turn Off' : 'Turn On'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SystemPage;
