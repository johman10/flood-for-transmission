<script>
  import Header from './Header.svelte';
</script>

<Header text="Flood Transmission" />
<p>
  Flood for Transmission is an alternative Web UI for Transmission. It's a frontend web app that doesn't require any extra service running to communicate with Transmission. Even though it's a work-in-progress, it's definitely good enough to use.

  Flood for Transmission is a clone of <a href="https://github.com/Flood-UI/flood" target="_blank">Flood</a>, which is originally build for rTorrent. All design and feature credit goes out to the creators of that. The code however is not a copy at all, it's been build from the ground up to make it work with Transmission.
</p>

<Header text="Feedback" />
<p>If you find an issue or bug, please file a <a href="https://github.com/johman10/flood-for-transmission/issues/new" target="_blank">GitHub issue</a>.</p>

<style>
  p {
    color: #7d8d9f;
    font-size: 14px;
    margin-bottom: 15px;
  }

  a {
    color: #3ea7ff;
    text-decoration: none;
  }
</style>
