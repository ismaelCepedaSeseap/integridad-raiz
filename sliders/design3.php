<div class="max-w-7xl mx-auto px-6">
  <div class="relative overflow-hidden rounded-[2.5rem] border border-green-200">
    <?php if (!empty($s['imagen'])): ?>
      <div class="absolute inset-0">
        <img src="<?php echo htmlspecialchars($s['imagen']); ?>" class="w-full h-full object-cover opacity-40" alt="">
      </div>
    <?php endif; ?>
    <div class="relative z-10 py-16 md:py-24 px-6 md:px-12 flex flex-col md:flex-row items-center gap-8">
      <div class="md:w-2/3">
        <h1 class="text-4xl md:text-6xl font-black text-slate-900 leading-tight"><?php echo htmlspecialchars($s['titulo']); ?></h1>
        <?php if (!empty($s['descripcion'])): ?>
          <p class="text-lg md:text-xl text-slate-700 mt-6 max-w-2xl"><?php echo htmlspecialchars($s['descripcion']); ?></p>
        <?php endif; ?>
        <?php if (!empty($s['cta_text']) && !empty($s['cta_url'])): ?>
          <div class="mt-8">
            <a href="<?php echo htmlspecialchars($s['cta_url']); ?>" class="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all inline-flex items-center gap-2"><i data-lucide="layout-grid"></i> <?php echo htmlspecialchars($s['cta_text']); ?></a>
          </div>
        <?php endif; ?>
      </div>
      <div class="md:w-1/3 hidden md:block"></div>
    </div>
  </div>
</div>
