<script>
  import { slide } from 'svelte/transition';
  import { afterUpdate } from 'svelte';
  import { torrents, filters, selectedTorrents } from '~helpers/stores';
  import {
    labelFilter,
    statusFilter,
    trackerFilter,
    priorityFilter,
  } from '~helpers/filterHelper';
  import LayersIcon from '@lucide/svelte/icons/layers';
  import ActivityIcon from '@lucide/svelte/icons/activity';
  import ArrowDownToLineIcon from '@lucide/svelte/icons/arrow-down-to-line';
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
  import CirclePauseIcon from '@lucide/svelte/icons/circle-pause';
  import ScanSearchIcon from '@lucide/svelte/icons/scan-search';
  import SproutIcon from '@lucide/svelte/icons/sprout';
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';

  const STATUS_ICONS = {
    All: LayersIcon,
    Active: ActivityIcon,
    DownloadSmall: ArrowDownToLineIcon,
    Completed: CircleCheckIcon,
    StopIcon: CirclePauseIcon,
    InformationIcon: ScanSearchIcon,
    SeedsIcon: SproutIcon,
    ErrorIcon: TriangleAlertIcon,
  };
  import Badge from '~components/Badge';

  const { labels, trackers } = torrents;

  const limitedLabelsCount = 3;
  const limitedTrackersCount = 4;
  let limitTrackers = true;
  let limitLabels = true;
  let previousLabelFiltersLength = 0;
  let previousTrackerFiltersLength = 0;

  $: statusFilters = [
    {
      label: 'All',
      value: null,
      iconName: 'All',
      count: $torrents.length,
    },
    {
      label: 'Active',
      value: 'active',
      iconName: 'Active',
      count: $torrents.filter(statusFilter.bind(null, 'active')).length,
    },
    {
      label: 'Downloading',
      value: 'downloading',
      iconName: 'DownloadSmall',
      count: $torrents.filter(statusFilter.bind(null, 'downloading')).length,
    },
    {
      label: 'Complete',
      value: 'complete',
      iconName: 'Completed',
      count: $torrents.filter(statusFilter.bind(null, 'complete')).length,
    },
    {
      label: 'Stopped',
      value: 'stopped',
      iconName: 'StopIcon',
      count: $torrents.filter(statusFilter.bind(null, 'stopped')).length,
    },
    {
      label: 'Checking',
      value: 'checking',
      iconName: 'InformationIcon',
      count: $torrents.filter(statusFilter.bind(null, 'checking')).length,
    },
    {
      label: 'Seeding',
      value: 'seeding',
      iconName: 'SeedsIcon',
      count: $torrents.filter(statusFilter.bind(null, 'seeding')).length,
    },
    {
      label: 'Error',
      value: 'error',
      iconName: 'ErrorIcon',
      count: $torrents.filter(statusFilter.bind(null, 'error')).length,
    },
  ];

  $: priorityFilters = [
    {
      label: 'All',
      value: null,
      count: $torrents.length,
    },
    {
      label: 'High',
      value: 1,
      count: $torrents.filter(priorityFilter.bind(null, 1)).length,
    },
    {
      label: 'Normal',
      value: 0,
      count: $torrents.filter(priorityFilter.bind(null, 0)).length,
    },
    {
      label: 'Low',
      value: -1,
      count: $torrents.filter(priorityFilter.bind(null, -1)).length,
    },
  ];

  $: labelFilters = [
    {
      label: 'All',
      value: null,
      count: $torrents.length,
    },
    {
      label: 'Unlabeled',
      value: 'unlabeled',
      count: $torrents.filter(labelFilter.bind(null, 'unlabeled')).length,
    },
    ...$labels
      .map((label) => ({
        label,
        value: label,
        count: $torrents.filter(labelFilter.bind(null, label)).length,
      }))
      .slice(0, limitLabels ? limitedLabelsCount : $labels.length),
    $filters.label && {
      label: $filters.label,
      value: $filters.label,
      count: $torrents.filter(trackerFilter.bind(null, $filters.label)).length,
    },
  ]
    .filter(Boolean)
    .filter(
      (item, index, list) =>
        list.map((i) => i.value).indexOf(item.value) === index
    );

  $: trackerFilters = [
    {
      label: 'All',
      value: null,
      count: $torrents.length,
    },
    ...$trackers
      .map((tracker) => ({
        label: tracker,
        value: tracker,
        count: $torrents.filter(trackerFilter.bind(null, tracker)).length,
      }))
      .slice(0, limitTrackers ? limitedTrackersCount : $trackers.length),
    $filters.tracker && {
      label: $filters.tracker,
      value: $filters.tracker,
      count: $torrents.filter(trackerFilter.bind(null, $filters.tracker))
        .length,
    },
  ]
    .filter(Boolean)
    .filter(
      (item, index, list) =>
        list.map((i) => i.value).indexOf(item.value) === index
    );

  const setStatusFilter = (filter) => {
    selectedTorrents.clear();
    $filters.status = filter;
  };

  const setLabelFilter = (filter) => {
    selectedTorrents.clear();
    $filters.label = filter;
  };

  const setTrackerFilter = (filter) => {
    selectedTorrents.clear();
    $filters.tracker = filter;
  };

  const setPriorityFilter = (filter) => {
    selectedTorrents.clear();
    $filters.priority = filter;
  };

  afterUpdate(() => {
    previousLabelFiltersLength = labelFilters.length;
    previousTrackerFiltersLength = trackerFilters.length;
  });

  const getTransitionConfig = (
    direction,
    previousListLength,
    listLength,
    index
  ) => {
    const totalDuration = 250;
    let duration;
    let delay;

    if (direction === 'in') {
      const items_to_transition = listLength - previousListLength;
      duration = totalDuration / items_to_transition;
      delay = index * duration - previousListLength * duration;
    } else {
      const items_to_transition = previousListLength - listLength;
      duration = totalDuration / items_to_transition;
      delay =
        (items_to_transition - 1 - index) * duration + listLength * duration;
    }

    return { delay, duration };
  };
</script>

<div class="wrapper">
  <h2>Filter by status</h2>
  <ul>
    {#each statusFilters as filter (filter.label)}
      <li
        class:active={$filters.status === filter.value}
        on:click={setStatusFilter.bind(null, filter.value)}
      >
        <svelte:component this={STATUS_ICONS[filter.iconName]} class="icon" />
        {filter.label}
        <Badge>{filter.count || 0}</Badge>
      </li>
    {/each}
  </ul>

  <h2>Filter by priority</h2>
  <ul>
    {#each priorityFilters as filter (filter.label)}
      <li
        class:active={$filters.priority === filter.value}
        on:click={setPriorityFilter.bind(null, filter.value)}
      >
        {filter.label}
        <Badge>{filter.count || 0}</Badge>
      </li>
    {/each}
  </ul>

  <h2>Filter by label</h2>
  <ul>
    {#each labelFilters as filter, index (filter.label)}
      <li
        class:active={$filters.label === filter.value}
        on:click={setLabelFilter.bind(null, filter.value)}
        in:slide={getTransitionConfig(
          'in',
          previousLabelFiltersLength,
          labelFilters.length,
          index
        )}
        out:slide={getTransitionConfig(
          'out',
          previousLabelFiltersLength,
          labelFilters.length,
          index
        )}
      >
        {filter.label}
        <Badge>{filter.count || 0}</Badge>
      </li>
    {/each}
    {#if labelFilters.length > limitedLabelsCount}
      <li
        on:click={() => {
          limitLabels = !limitLabels;
        }}
      >
        {#if limitLabels}Show all...{:else}Hide some...{/if}
      </li>
    {/if}
  </ul>

  <h2>Filter by tracker</h2>
  <ul>
    {#each trackerFilters as filter, index (filter.label)}
      <li
        class:active={$filters.tracker === filter.value}
        on:click={setTrackerFilter.bind(null, filter.value)}
        in:slide={getTransitionConfig(
          'in',
          previousTrackerFiltersLength,
          trackerFilters.length,
          index
        )}
        out:slide={getTransitionConfig(
          'out',
          previousTrackerFiltersLength,
          trackerFilters.length,
          index
        )}
      >
        {filter.label}
        <Badge>{filter.count || 0}</Badge>
      </li>
    {/each}
    {#if trackerFilters.length > limitedTrackersCount}
      <li
        on:click={() => {
          limitTrackers = !limitTrackers;
        }}
      >
        {#if limitTrackers}Show all...{:else}Hide some...{/if}
      </li>
    {/if}
  </ul>
</div>

<style>
  .wrapper {
    padding: 8px 8px 0;
    color: var(--sidebar-foreground);
  }

  h2 {
    padding: 0 8px;
    margin: 12px 0 4px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--muted-foreground);
  }

  ul {
    list-style: none;
    margin-bottom: 8px;
  }

  li {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 28px;
    padding: 0 8px;
    border-radius: 6px;
    font-size: 13px;
    transition:
      background-color 0.15s,
      color 0.15s;
  }

  li:hover {
    background-color: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
  }

  li.active {
    background-color: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
    font-weight: 500;
  }

  li > :global(.icon) {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
    color: var(--muted-foreground);
  }

  li.active > :global(.icon) {
    color: var(--primary);
  }

  li > :global(.badge) {
    margin-left: auto;
    background: transparent;
  }

  li.active > :global(.badge) {
    background-color: var(--primary);
    color: var(--primary-foreground);
  }
</style>
