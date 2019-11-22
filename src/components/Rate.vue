<template>
   <div class="text-center">
    <v-rating
      v-model="rating"
      background-color="indigo lighten-3"
      color="indigo"
      size="64"
    ></v-rating>
  </div>
</template>

<script>
  export default {
    data: () => ({
      rating: 4,
    }),
  }
</script