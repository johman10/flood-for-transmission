<script>
  import { slide } from 'svelte/transition';
  import { torrents, filters, selectedTorrents } from '~helpers/stores';
  import {
    labelFilter,
    statusFilter,
    trackerFilter,
  } from '~helpers/filterHelper';
  import Icon from '~components/Icon';
  import Badge from '~components/Badge';

  const { labels, trackers } = torrents;

  const limitedLabelsCount = 3;
  const limitedTrackersCount = 4;
  let limitTrackers = true;
  let limitLabels = true;

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

  const getTransitionConfig = (direction, listLength, index) => {
    const duration = 250 / listLength;
    const delayMultiplier = direction === 'in' ? index : listLength - index;
    return { delay: delayMultiplier * duration, duration };
  };
</script>

<div class="wrapper">
  <h2>Filter by status</h2>
  <ul>
    {#each statusFilters as filter}
      <li
        class:active="{$filters.status === filter.value}"
        on:click="{setStatusFilter.bind(null, filter.value)}"
      >
        <Icon name="{filter.iconName}" />
        {filter.label}
        <Badge>{filter.count || 0}</Badge>
      </li>
    {/each}
  </ul>

  <h2>Filter by label</h2>
  <ul>
    {#each labelFilters as filter, index}
      <li
        class:active="{$filters.label === filter.value}"
        on:click="{setLabelFilter.bind(null, filter.value)}"
        in:slide="{getTransitionConfig('in', labelFilters.length, index)}"
        out:slide="{getTransitionConfig('out', labelFilters.length, index)}"
      >
        {filter.label}
        <Badge>{filter.count || 0}</Badge>
      </li>
    {/each}
    {#if labelFilters.length > limitedLabelsCount}
      <li
        on:click="{() => {
          limitLabels = !limitLabels;
        }}"
      >
        {#if limitLabels}Show all...{:else}Hide some...{/if}
      </li>
    {/if}
  </ul>

  <h2>Filter by tracker</h2>
  <ul>
    {#each trackerFilters as filter, index}
      <li
        class:active="{$filters.tracker === filter.value}"
        on:click="{setTrackerFilter.bind(null, filter.value)}"
        in:slide="{getTransitionConfig('in', trackerFilters.length, index)}"
        out:slide="{getTransitionConfig('out', trackerFilters.length, index)}"
      >
        {filter.label}
        <Badge>{filter.count || 0}</Badge>
      </li>
    {/each}
    {#if trackerFilters.length > limitedTrackersCount}
      <li
        on:click="{() => {
          limitTrackers = !limitTrackers;
        }}"
      >
        {#if limitTrackers}Show all...{:else}Hide some...{/if}
      </li>
    {/if}
  </ul>
</div>

<style>
  .wrapper {
    margin: 30px 20px 0;
    color: var(--color-panel-text);
    fill: currentColor;
  }

  h2 {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    color: var(--color-panel-header);
  }

  ul {
    list-style: none;
    margin-bottom: 30px;
  }

  li {
    cursor: pointer;
    font-weight: 400;
    padding: 3px 0;
    display: flex;
    align-items: center;
    transition: fill 0.25s, color 0.25s;
    font-size: 13px;
  }

  li:hover {
    color: var(--color-panel-hover);
  }

  li:hover > :global(.badge) {
    background-color: var(--color-panel-hover);
  }

  li.active {
    color: var(--color-panel-active);
    font-weight: 700;
  }

  li > :global(.icon) {
    height: 14px;
    margin-right: 7px;
  }

  li.active > :global(.badge) {
    background-color: var(--color-panel-active);
  }
</style>
