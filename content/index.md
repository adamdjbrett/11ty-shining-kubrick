---
title: Kubrik 11ty
description: A kubick starter themes for eleventy projects.
layout: welcome.njk
image: 
pagination:
  data: collections.posts
  size: 5
  reverse: true
testdata:
 - item1
 - item2
 - item3
 - item4
permalink: "/{% if pagination.pageNumber > 0 %}page-{{ pagination.pageNumber + 1 }}/{% endif %}index.html"
---
