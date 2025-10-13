# Styling Guide

This document outlines the styling guidelines for the modernized EMS application.

## Color Palette

| Name          | Hex       | Usage                               |
|---------------|-----------|-------------------------------------|
| Primary       | `#6a11cb` | Main brand color, buttons, links    |
| Secondary     | `#2575fc` | Secondary actions, accents          |
| Light         | `#ffffff` | Backgrounds, text                   |
| Dark          | `#000000` | Text, overlays                      |
| Glass         | `rgba(255, 255, 255, 0.1)` | Glassmorphism effect |

## Gradients

| Name              | From      | To        | Usage                               |
|-------------------|-----------|-----------|-------------------------------------|
| Primary Gradient  | `#6a11cb` | `#2575fc` | Main background, cards, buttons     |
| Secondary Gradient| `#ff6a00` | `#ee0979` | Secondary actions, accents          |

## Typography

| Name      | Font Family | Font Size | Font Weight | Usage         |
|-----------|-------------|-----------|-------------|---------------|
| Heading 1 | `sans-serif`| `2.5rem`  | `700`       | Page titles   |
| Heading 2 | `sans-serif`| `2rem`    | `600`       | Section titles|
| Body      | `sans-serif`| `1rem`    | `400`       | Paragraphs    |

## Glassmorphism

The glassmorphism effect will be achieved using the following CSS properties:

```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border-radius: 10px;
border: 1px solid rgba(255, 255, 255, 0.2);