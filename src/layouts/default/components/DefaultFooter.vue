<template>
  <footer
    class="
      border-solid border-t border-light-blue-500
      p-4
      bg-white
      sm:hidden
      md:flex md:items-center md:justify-between md:p-6
      dark:bg-gray-800
    "
  >
    <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
      >© 2021 <a href="https://flowbite.com" class="hover:underline">China Post</a>. All
      Rights Reserved.
    </span>
    <ul
      class="
        flex flex-wrap
        items-center
        mt-3
        text-sm text-gray-500
        dark:text-gray-400
        sm:mt-0
      "
    >
      <li>
        <a href="#" class="mr-4 hover:underline md:mr-6">About</a>
      </li>
      <li>
        <a href="#" class="mr-4 hover:underline md:mr-6">Privacy Policy</a>
      </li>
      <li>
        <a href="#" class="mr-4 hover:underline md:mr-6">Licensing</a>
      </li>
      <li>
        <a href="#" class="hover:underline">Contact</a>
      </li>
    </ul>
  </footer>
</template>

<script lang="ts" setup name="DefaultFooter"></script>
