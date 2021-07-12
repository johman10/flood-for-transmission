<script>
  import { scaleLinear } from 'd3-scale';
  import { line, area, curveMonotoneX } from 'd3-shape';
  import { max } from 'd3-array';
  import { rateData, session, torrents } from '~helpers/stores';
  import Icon from '~components/Icon';
  import Bytes from '~components/Graph/Bytes.svelte';
  import SpeedLimit from '~components/Graph/SpeedLimit.svelte';
  import { relativeTime } from '~helpers/timeHelper';
  import { getSize } from '~helpers/sizeHelper';
  import {
    SESSION_COLUMN_UNITS,
    SESSION_COLUMN_UNITS_SIZE,
  } from '~helpers/constants/columns';

  let mouseX = 0;
  let hovering = false;
  const margin = { bottom: 10, top: 10 };
  const totalRateStore = torrents.totalRate;

  const setInspectorCoordinates = (data, defaultTransform) => {
    if (!xScale || !hovering) {
      return {
        circleTransform: defaultTransform,
        speed: null,
        timestamp: null,
      };
    }
    const hoverPoint = xScale.invert(mouseX);
    const upperSpeed = data[Math.ceil(hoverPoint)];
    const lowerSpeed = data[Math.floor(hoverPoint)];

    const delta = upperSpeed - lowerSpeed;
    const speed = lowerSpeed + delta * (hoverPoint % 1);
    const timestamp = $rateData.timestamps[Math.round(hoverPoint)];

    const x = xScale(hoverPoint);
    const y = yScale(speed);

    return {
      circleTransform: `translate(${x},${y})`,
      speed,
      timestamp,
    };
  };

  $: downloadLinePath = linePath($rateData.download);
  $: downloadAreaPath = areaPath($rateData.download);
  $: uploadLinePath = linePath($rateData.upload);
  $: uploadAreaPath = areaPath($rateData.upload);
  $: ({
    circleTransform: uploadCircleTransform,
    speed: uploadSpeed,
    timestamp,
  } = setInspectorCoordinates($rateData.upload, uploadCircleTransform));
  $: ({ circleTransform: downloadCircleTransform, speed: downloadSpeed } =
    setInspectorCoordinates($rateData.download, downloadCircleTransform));

  $: ({ value: displayUploadSpeed, size: displayUploadSize } = getSize(
    uploadSpeed !== null ? uploadSpeed : $totalRateStore.upload,
    {
      isSpeed: true,
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
    }
  ));
  $: ({ value: displayDownloadSpeed, size: displayDownloadSize } = getSize(
    downloadSpeed !== null ? downloadSpeed : $totalRateStore.download,
    {
      isSpeed: true,
      perSize: $session[SESSION_COLUMN_UNITS]?.[SESSION_COLUMN_UNITS_SIZE],
    }
  ));

  $: xScale = scaleLinear()
    .domain([0, $rateData.download.length - 1])
    .range([0, 240]);

  $: yScale = scaleLinear()
    .domain([
      0,
      max($rateData.download, (dataPoint, index) =>
        Math.max(dataPoint, $rateData.upload[index])
      ) || 1,
    ])
    .range([150 - margin.top, margin.bottom]);

  $: linePath = line()
    .x((dataPoint, index) => xScale(index))
    .y(yScale)
    .curve(curveMonotoneX);

  $: areaPath = area()
    .x((dataPoint, index) => xScale(index))
    .y0(150)
    .y1(yScale)
    .curve(curveMonotoneX);

  const handleMouseMove = (event) => {
    hovering = true;
    const rect = event.target.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    ({
      circleTransform: uploadCircleTransform,
      speed: uploadSpeed,
      timestamp,
    } = setInspectorCoordinates($rateData.upload));
    ({ circleTransform: downloadCircleTransform, speed: downloadSpeed } =
      setInspectorCoordinates($rateData.download));
  };

  const handleMouseLeave = () => {
    hovering = false;
    ({ speed: uploadSpeed, timestamp } = setInspectorCoordinates(
      $rateData.upload
    ));
    ({ speed: downloadSpeed } = setInspectorCoordinates($rateData.download));
  };
</script>

<div class="rates">
  <div class="rate rate--download">
    <Icon name="Download" />
    <div class="data">
      <div class="speed speed--download">
        {displayDownloadSpeed}
        <span class="speed__size">{displayDownloadSize}</span>
      </div>
      <Bytes direction="download" hidden="{hovering}" />
      <SpeedLimit direction="download" hidden="{hovering}" />
    </div>
  </div>
  <div class="rate rate--upload">
    <Icon name="Upload" />
    <div class="data">
      <div class="speed speed--upload">
        {displayUploadSpeed}
        <span class="speed__size">{displayUploadSize}</span>
      </div>
      <Bytes direction="upload" hidden="{hovering}" />
      <SpeedLimit direction="upload" hidden="{hovering}" />
    </div>
  </div>
  <div class="timestamp" class:hidden="{!hovering}">
    {relativeTime(timestamp)}
  </div>
</div>

<svg
  class="graph"
  on:mousemove="{handleMouseMove}"
  on:mouseleave="{handleMouseLeave}"
>
  <defs>
    <linearGradient id="gradient--upload" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop class="top upload" offset="0%"></stop>
      <stop class="bottom upload" offset="100%"></stop>
    </linearGradient>
    <linearGradient id="gradient--download" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop class="top download" offset="0%"></stop>
      <stop class="bottom download" offset="100%"></stop>
    </linearGradient>
  </defs>
  <path
    class="area area--download"
    fill="url(#gradient--download)"
    d="{downloadAreaPath}"></path>
  <path
    class="area area--upload"
    fill="url(#gradient--upload)"
    d="{uploadAreaPath}"></path>
  <path class="line line--download" d="{downloadLinePath}"></path>
  <path class="line line--upload" d="{uploadLinePath}"></path>
  <circle
    r="2.5"
    class="circle circle--download"
    class:circle--active="{hovering}"
    transform="{downloadCircleTransform}"></circle>
  <circle
    r="2.5"
    class="circle circle--upload"
    class:circle--active="{hovering}"
    transform="{uploadCircleTransform}"></circle>
</svg>

<style>
  .rates {
    display: grid;
    grid-template:
      'rate-download rate-upload' auto
      'timestamp timestamp' auto / 1fr 1fr;
    font-size: 12px;
    padding: 0 10px;
    line-height: 1;
  }

  .rate--download {
    grid-area: rate-download;
  }

  .rate--upload {
    grid-area: rate-upload;
  }

  .rate {
    display: flex;
    flex-grow: 1;
    flex-shrink: 0;
  }

  .rate > :global(.icon) {
    display: block;
    opacity: 0.375;
    min-width: 20px;
    height: 20px;
  }

  .rate--download > :global(.icon) {
    fill: var(--color-download);
  }

  .rate--upload > :global(.icon) {
    fill: var(--color-upload);
  }

  .data {
    display: grid;
    grid-template:
      'speed speed speed' 26px
      'bytes limit -' auto / 1fr fit-content(20px) 1fr;
    column-gap: 5px;
    row-gap: 1px;
  }

  .speed {
    grid-area: speed;
    font-size: 24px;
    letter-spacing: -0.5px;
  }

  .speed--download {
    color: var(--color-download);
  }

  .speed--upload {
    color: var(--color-upload);
  }

  .speed__size {
    font-size: 16px;
    opacity: 0.5;
  }

  .timestamp {
    grid-area: timestamp;
    color: var(--color-graph-text);
    font-style: italic;
    text-align: center;
    width: 100%;
    transition: opacity 0.25s;
    margin-top: -8px;
  }

  .timestamp.hidden {
    opacity: 0;
  }

  .graph {
    width: 100%;
  }

  stop.download {
    stop-color: var(--color-download);
  }

  stop.upload {
    stop-color: var(--color-upload);
  }

  stop.top {
    stop-opacity: 0.2;
  }

  stop.bottom {
    stop-opacity: 0;
  }

  .line {
    stroke-opacity: 0.5;
    stroke-width: 2px;
    fill: transparent;
  }

  .line--upload {
    stroke: var(--color-upload);
  }

  .line--download {
    stroke: var(--color-download);
  }

  .circle--download {
    fill: var(--color-download);
  }

  .circle--upload {
    fill: var(--color-upload);
  }

  .circle {
    transition: opacity 0.2s;
    opacity: 0;
  }

  .circle--active {
    opacity: 1;
  }
</style>
