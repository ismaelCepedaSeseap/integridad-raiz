<div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
  <div class="md:w-1/2">
    <?php if (!empty($s['subtitulo'])): ?>
      <span class="inline-block px-4 py-1 rounded-full bg-blue-200 text-blue-800 text-[10px] font-black mb-6 uppercase tracking-widest"><?php echo htmlspecialchars($s['subtitulo']); ?></span>
    <?php endif; ?>
    <h1 class="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-[1.1]"><?php echo htmlspecialchars($s['titulo']); ?></h1>
    <?php if (!empty($s['descripcion'])): ?>
      <p class="text-xl text-slate-600 mb-10 max-w-lg leading-relaxed"><?php echo htmlspecialchars($s['descripcion']); ?></p>
    <?php endif; ?>
    <div class="flex flex-wrap gap-4">
      <?php if (!empty($s['cta_text']) && !empty($s['cta_url'])): ?>
        <a href="<?php echo htmlspecialchars($s['cta_url']); ?>" class="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl hover:bg-blue-700 transition-all flex items-center gap-2"><?php echo htmlspecialchars($s['cta_text']); ?></a>
      <?php endif; ?>
    </div>
  </div>
  <div class="md:w-1/2 flex justify-center">
    <?php if (!empty($s['imagen'])): ?>
      <img src="<?php echo htmlspecialchars($s['imagen']); ?>" class="w-64 opacity-50" alt="">
    <?php endif; ?>
  </div>
</div>
