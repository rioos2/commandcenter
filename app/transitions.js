export default function() {

  let duration = 500;

  this.transition(
    this.fromRoute(['homes']),
    this.toRoute(['sections']),
    this.use('explode', {
      matchBy: 'data-cover',
      use: ['fly-to', { duration }]
    })
  );

  this.transition(
    this.fromRoute(['sections', 'pages', 'galleries']),
    this.toRoute(['homes']),
    this.useAndReverse('crossFade', { duration })
  );

  this.transition(
    this.fromRoute(['homes.home-1', 'homes.home-2', 'homes.home', 'homes.home-4']),
    this.toRoute(['homes.home-1', 'homes.home-2', 'homes.home', 'homes.home-4']),
    this.useAndReverse('crossFade', { duration })
  );

  this.transition(
    this.toRoute(['sections.section-1', 'sections.section-2', 'sections.section-3']),
    this.useAndReverse('explode', {
      matchBy: 'data-cover',
      use: ['fly-to', { duration }]
    })
  );

  this.transition(
    this.fromRoute(['pages', 'galleries']),
    this.useAndReverse('toLeft', { duration })
  );

  let pages = [
    'pages.contact-us',
    'pages.about-us',
    'pages.blog',
    'pages.coming-soon',
    'pages.clients',
    'pages.faqs',
    'pages.invoice',
    'pages.pricing',
    'pages.error-404',
    'pages.search',
    'pages.services',
    'galleries.flex',
    'galleries.masonry',
    'galleries.justified'
  ];

  this.transition(
    this.fromRoute(pages),
    this.toRoute(pages),
    this.useAndReverse('toLeft', { duration })
  );

}
