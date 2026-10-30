<script>
  import Header from './Header.svelte';
</script>

<Header text="Drought" />
<p>
  Drought is a fast, desktop-style web UI for Transmission. It talks to
  Transmission directly, so it doesn't need any extra service running.
</p>
<p>
  Drought started as a fork of
  <a href="https://github.com/johman10/flood-for-transmission" target="_blank"
    >Flood for Transmission</a
  >, which in turn is based on the design of
  <a href="https://github.com/Flood-UI/flood" target="_blank">Flood</a>. Credit
  for the original design and features goes to their creators.
</p>

<Header text="Feedback" />
<p>
  If you have a specific issue or bug, please file a
  <a href="https://github.com/kiesxoxo/drought/issues/new" target="_blank"
    >GitHub issue</a
  >. Also feel free to bring up feature requests that way.
</p>

<style>
  p {
    color: var(--color-modal-text);
    font-size: 14px;
    margin-bottom: 15px;
  }

  a {
    color: var(--color-modal-link);
    text-decoration: none;
  }
</style>
