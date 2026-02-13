<div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
  <div class="md:w-1/2">
    <?php if (!empty($s['subtitulo'])): ?>
      <span class="inline-block px-4 py-1 rounded-full bg-green-200 text-green-800 text-[10px] font-black mb-6 uppercase tracking-widest"><?php echo htmlspecialchars($s['subtitulo']); ?></span>
    <?php endif; ?>
    <h1 class="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-[1.1]"><?php echo htmlspecialchars($s['titulo']); ?></h1>
    <?php if (!empty($s['descripcion'])): ?>
      <p class="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed"><?php echo htmlspecialchars($s['descripcion']); ?></p>
    <?php endif; ?>
    <div class="flex flex-wrap gap-4">
      <?php if (!empty($s['cta_text']) && !empty($s['cta_url'])): ?>
        <a href="<?php echo htmlspecialchars($s['cta_url']); ?>" class="px-8 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl hover:bg-green-700 transition-all flex items-center gap-2"><i data-lucide="play-circle"></i> <?php echo htmlspecialchars($s['cta_text']); ?></a>
      <?php endif; ?>
    </div>
  </div>
  <div class="md:w-1/2 flex justify-center relative">
    <div class="relative w-full max-w-lg aspect-square flex items-center justify-center">
      <div class="absolute w-[85%] h-[85%] bg-white rounded-full shadow-2xl border-8 border-green-500/20"></div>
      <?php if (!empty($s['imagen'])): ?>
        <img src="<?php echo htmlspecialchars($s['imagen']); ?>" alt="" class="relative z-20 w-full h-auto transform scale-110 drop-shadow-2xl">
      <?php endif; ?>
    </div>
  </div>
</div>
