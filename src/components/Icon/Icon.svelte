<script>
  import Add from './Add.svelte';
  import All from './All.svelte';
  import CheckboxCheckmark from './CheckboxCheckmark.svelte';
  import Checkmark from './Checkmark.svelte';
  import Chevron from './Chevron.svelte';
  import CircleCheckmarkIcon from './CircleCheckmarkIcon.svelte';
  import CircleExclamationIcon from './CircleExclamationIcon.svelte';
  import Completed from './Completed.svelte';
  import Disk from './Disk.svelte';
  import Download from './Download.svelte';
  import DownloadSmall from './DownloadSmall.svelte';
  import ErrorIcon from './ErrorIcon.svelte';
  import ETA from './ETA.svelte';
  import File from './File.svelte';
  import Files from './Files.svelte';
  import InfinityIcon from './InfinityIcon.svelte';
  import InformationIcon from './InformationIcon.svelte';
  import Limits from './Limits.svelte';
  import RatioIcon from './RatioIcon.svelte';
  import Remove from './Remove.svelte';
  import Search from './Search.svelte';
  import SeedsIcon from './SeedsIcon.svelte';
  import SettingsIcon from './SettingsIcon.svelte';
  import SpinnerIcon from './SpinnerIcon.svelte';
  import StartIcon from './StartIcon.svelte';
  import StopIcon from './StopIcon.svelte';
  import Upload from './Upload.svelte';

  const iconMap = {
    Add,
    All,
    CheckboxCheckmark,
    Checkmark,
    Chevron,
    CircleCheckmarkIcon,
    CircleExclamationIcon,
    Completed,
    Disk,
    Download,
    DownloadSmall,
    ErrorIcon,
    ETA,
    File,
    Files,
    InfinityIcon,
    InformationIcon,
    Limits,
    RatioIcon,
    Remove,
    Search,
    SeedsIcon,
    SettingsIcon,
    SpinnerIcon,
    StartIcon,
    StopIcon,
    Upload,
  };

  export let viewBox = '0 0 60 60';
  export let name;
</script>

<svelte:component this="{iconMap[name]}" viewBox="{viewBox}" on:click />
