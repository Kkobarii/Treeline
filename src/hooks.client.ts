import { installDevConsoleGate } from '$lib/utils/devConsoleGate';
import { getDevSessionDebugEnabled } from '$lib/utils/devSessionDebugGate';

// Install as early as possible in the client lifecycle so route/component setup logs are gated too.
installDevConsoleGate(() => getDevSessionDebugEnabled());
