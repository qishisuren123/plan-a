// Plan A — Research Directions (detailed project plans)
// All data is based on real literature research (October 2024 - October 2025)
// Key references: ModelAngelo (Nat 2024), DeepEMhancer, DiffModeler, CryoFM, Merizo, AlphaFold-Multimer, Cryo-IEF (Nat Methods 2025), DeepQs

window.RESEARCH_DATA = {

  // ════════════════════════════════════════════════════════
  // DIRECTION 1: De Novo Atomic Model Building from Density
  // ════════════════════════════════════════════════════════
  model_building: [
    {
      title_en: "Resolution-Aware De Novo Model Builder (1.5–6 Å)",
      title_zh: "分辨率自适应的端到端模型构建器",
      summary_en: "Train a single foundation model that builds atomic models across the full cryo-EM resolution range, conditioned on local resolution and Q-score.",
      summary_zh: "训练单一基础模型在整个冷冻电镜分辨率范围（1.5–6 Å）下做原子建模，以局部分辨率和 Q-score 为条件。",

      problem: `<strong>The state-of-the-art ModelAngelo (Jamali et al., <em>Nature</em> 2024)</strong> was trained on only <strong>~700 manually curated map-model pairs</strong> and performs well at high resolution (< 4 Å), but its accuracy collapses at 4-6 Å where most newly determined complexes lie. <strong>DeepTracer</strong>, <strong>EMBuild</strong>, and similar tools also degrade severely at intermediate resolution. According to recent benchmarks, only 23-34% of low-resolution targets achieve high-accuracy reconstruction. <p>The core bottleneck is <strong>not architecture but data</strong>: there is no large-scale dataset that pairs density at <em>varying resolutions</em> with atomic-level labels and quality grading. EMDB now has ~9,000 entries < 4 Å resolution but most are redundant; the truly unique training pool is far smaller than AlphaFold2's ~200K structures.</p>`,
      problem_zh: `<strong>当前 SOTA 的 ModelAngelo (Jamali et al., <em>Nature</em> 2024)</strong> 仅在 <strong>~700 个手动整理的密度图-模型对</strong>上训练，高分辨率（< 4 Å）效果好，但在 4-6 Å 中等分辨率（即大多数新解结构所在区间）准确度急剧下降。<strong>DeepTracer</strong>、<strong>EMBuild</strong> 等工具同样在中等分辨率下失败。最新基准显示，低分辨率目标只有 23-34% 能高精度重建。<p>核心瓶颈<strong>不在架构而在数据</strong>：没有大规模数据集把<em>不同分辨率</em>的密度图与原子级标签和质量分级配对起来。EMDB 现有 ~9,000 个 < 4 Å 条目但大多冗余，唯一训练池远小于 AlphaFold2 的 ~200K 结构。</p>`,

      approach: `<p>用 Plan A 的 <strong>11,000+ 条目（vs ModelAngelo 700）</strong>，以 <code>label_aa</code>（20 类氨基酸）+ <code>label_atom</code>（CA/C/N/O/CB）+ <code>label_qscore</code>（每原子置信度）三通道作为主监督信号。</p><p><strong>架构：</strong>采用 SE(3)-equivariant 3D U-Net backbone（参考 ModelAngelo），但加入 <em>resolution token</em> 作为额外 condition input（FiLM 调制），使单一模型能处理 1-6 Å 范围。借鉴 DiffModeler (2024) 的 DDIM 思想，让模型在推理时迭代细化 backbone 位置。</p><p><strong>训练策略：</strong>(1) 按 Plan A 的 Gold/Silver/Bronze 分档做 <strong>curriculum learning</strong> —— 从 Gold 高质量条目开始，逐步加入难例。(2) 用 <code>label_qscore</code> 做 <strong>loss reweighting</strong>，让模型学会"知道自己不确定哪里"。(3) 引入 <strong>uncertainty-aware mode</strong>：低 Q-score 区域输出"hallucination flag"，避免错误建模。</p>`,
      approach_zh: `<p>用 Plan A 的 <strong>11,000+ 条目（对比 ModelAngelo 仅 700）</strong>，以 <code>label_aa</code>（20 类氨基酸）+ <code>label_atom</code>（CA/C/N/O/CB）+ <code>label_qscore</code>（每原子置信度）三通道作为主监督信号。</p><p><strong>架构：</strong>采用 SE(3)-等价 3D U-Net 主干（参考 ModelAngelo），但加入 <em>分辨率 token</em> 作为额外条件输入（FiLM 调制），让单一模型能处理 1-6 Å 范围。借鉴 DiffModeler (2024) 的 DDIM 思想，推理时迭代细化骨架位置。</p><p><strong>训练策略：</strong>(1) 按 Plan A 的 Gold/Silver/Bronze 分档做<strong>课程学习</strong>，从 Gold 高质量条目开始逐步加入难例。(2) 用 <code>label_qscore</code> 做 <strong>loss 重加权</strong>，让模型学会"知道自己哪里不确定"。(3) 引入<strong>不确定性感知模式</strong>：低 Q-score 区域输出"幻觉警示"，避免错误建模。</p>`,

      evaluation: `<ul><li><strong>主要指标</strong>：CA RMSD vs ground truth、completeness（残基覆盖率）、sequence identity（如果对应序列已知）、TM-score</li><li><strong>对比基线</strong>：ModelAngelo (Nat 2024), DeepTracer, MICA (2025), DiffModeler</li><li><strong>Benchmark</strong>：EMDB 中 2024-2025 新发布的 100 个条目（zero-shot，未出现在训练集），覆盖 1.5-6 Å 全分辨率</li><li><strong>Ablation</strong>：(1) 分辨率 token 的作用，(2) 课程学习 vs 随机训练，(3) Q-score 重加权的作用</li></ul>`,
      evaluation_zh: `<ul><li><strong>主要指标</strong>：CA RMSD vs 真值、completeness（残基覆盖率）、序列一致性（如已知）、TM-score</li><li><strong>对比基线</strong>：ModelAngelo (Nat 2024), DeepTracer, MICA (2025), DiffModeler</li><li><strong>Benchmark</strong>：EMDB 中 2024-2025 新发布的 100 个条目（零样本，未出现在训练集），覆盖 1.5-6 Å 全分辨率</li><li><strong>消融</strong>：(1) 分辨率 token 作用，(2) 课程学习 vs 随机训练，(3) Q-score 重加权作用</li></ul>`,

      publication: `<p><strong>目标期刊：Nature Methods 或 Nature Communications</strong>。理由：ModelAngelo 发表于 <em>Nature</em>，本工作如果能在 4-6 Å 区间实现 ModelAngelo 在 < 4 Å 时的同等水平（completeness > 80%），就是该领域的关键突破。Nature Methods 近年高度关注此方向，2024-2025 已收录 DiffModeler、CryoTEN、DeepMainmast、MICA 等系列工作。</p><p><strong>工作量：6-9 人月</strong>。数据已就绪（Plan A）；架构基于现有 SE(3)-equivariant U-Net + diffusion 框架可快速搭建；训练 ~2 周（4 × A100）；评测和写作 2 月。</p>`,
      publication_zh: `<p><strong>目标期刊：Nature Methods 或 Nature Communications</strong>。理由：ModelAngelo 发表于 <em>Nature</em>，本工作如果能在 4-6 Å 区间达到 ModelAngelo 在 < 4 Å 的同等水平（completeness > 80%），是该领域的关键突破。Nature Methods 近年高度关注此方向，2024-2025 已收录 DiffModeler、CryoTEN、DeepMainmast、MICA 等系列工作。</p><p><strong>工作量：6-9 人月</strong>。数据已就绪（Plan A）；架构基于现有 SE(3)-等价 U-Net + 扩散框架可快速搭建；训练约 2 周（4 × A100）；评测与写作 2 月。</p>`,

      risks: `<ul><li><strong>风险 1</strong>：4-6 Å 区间噪声太大，原子级标签可能不够准 → 缓解：用 <code>label_qscore</code> 加权，配合 ChimeraX 模拟密度做辅助监督</li><li><strong>风险 2</strong>：SE(3)-equivariant 网络训练慢 → 缓解：先用普通 3D U-Net 验证可行性，再换 equivariant</li><li><strong>风险 3</strong>：和 ModelAngelo 的 GNN 后处理对比，可能需要类似的图优化步骤</li></ul>`,
      risks_zh: `<ul><li><strong>风险 1</strong>：4-6 Å 区间噪声大，原子级标签可能不够准 → 缓解：用 <code>label_qscore</code> 加权，配合 ChimeraX 模拟密度做辅助监督</li><li><strong>风险 2</strong>：SE(3)-等价网络训练慢 → 缓解：先用普通 3D U-Net 验证可行性，再换等价版本</li><li><strong>风险 3</strong>：可能需要类似 ModelAngelo 的 GNN 后处理步骤</li></ul>`,

      tags: ['Diffusion Model', 'SE(3)-Equivariant', 'Resolution-Aware', '6-9 person-months', 'Nature Methods']
    },

    {
      title_en: "Density-Conditional Residue Typing without MSA",
      title_zh: "无需 MSA 的密度条件氨基酸识别",
      summary_en: "Identify amino acid types directly from cryo-EM density without requiring sequence input — the first 'sequence-free' residue identifier.",
      summary_zh: "无需序列输入，直接从密度图识别氨基酸类型 —— 首个'无序列'残基识别器。",

      problem: `<strong>ModelAngelo 2024</strong> identifies novel proteins by HMM search on predicted amino acid probabilities, but the per-residue identification accuracy heavily depends on the <em>cryo-EM map quality and sequence database</em>. When the sample contains <strong>unknown sequences, post-translational modifications, or contaminants</strong>, current methods fail. For metaproteomics, environmental cryo-EM, and structural biology of uncharacterized organisms, <strong>there is no method that reliably types amino acids purely from density</strong>. <p>Existing methods rarely report per-class accuracy: confusion between similar residues (e.g., LEU/ILE/VAL, ASP/ASN, GLU/GLN) is severe at < 3 Å resolution and approaches random at 4 Å. No publicly available dataset provides large-scale (density patch ↔ residue type) supervised pairs.</p>`,
      problem_zh: `<strong>ModelAngelo 2024</strong> 通过对预测氨基酸概率做 HMM 搜索来识别新蛋白，但每残基识别精度严重依赖<em>密度图质量和序列数据库</em>。当样品包含<strong>未知序列、翻译后修饰或污染物</strong>时，现有方法失效。对宏蛋白质组学、环境冷冻电镜、未表征生物的结构生物学而言，<strong>没有方法可以纯粹从密度图可靠识别氨基酸</strong>。<p>现有方法很少报告每类准确率：相似残基的混淆（如 LEU/ILE/VAL, ASP/ASN, GLU/GLN）在 < 3 Å 时严重，到 4 Å 几乎变成随机。没有公开数据集提供大规模（密度块 ↔ 残基类型）监督对。</p>`,

      approach: `<p>用 Plan A 的 <code>label_aa</code>（20 类，11K 条目数百万个 CA 位点）训练 <strong>local volume → residue class</strong> 分类器。每个样本：以 CA 为中心 8 Å × 8 Å × 8 Å 密度立方体 + Q-score 加权。</p><p><strong>架构</strong>：3D ViT（patch=2 Å）+ 旋转等价数据增强（在训练时随机旋转输入立方体）。引入 <strong>resolution embedding</strong> 让模型知道当前样本的局部分辨率。</p><p><strong>训练目标</strong>：(1) 主任务：21 类分类（20 标准 AA + 1 unknown）；(2) 辅助任务：预测局部 Q-score；(3) 对比学习：相同残基类型的不同立方体应有相似 embedding。</p><p><strong>下游应用</strong>：直接 plug-in 到 ModelAngelo / DeepTracer 替换其氨基酸识别模块。也可独立作为 cryo-EM 数据库的<em>残基类型检索</em>工具。</p>`,
      approach_zh: `<p>用 Plan A 的 <code>label_aa</code>（20 类，11K 条目数百万 CA 位点）训练 <strong>局部体素 → 残基类</strong>分类器。每样本：以 CA 为中心 8 Å × 8 Å × 8 Å 密度立方体 + Q-score 加权。</p><p><strong>架构</strong>：3D ViT (patch=2 Å) + 旋转等价数据增强。引入<strong>分辨率 embedding</strong> 让模型感知当前样本局部分辨率。</p><p><strong>训练目标</strong>：(1) 主任务：21 类分类（20 标准氨基酸 + 1 unknown）；(2) 辅助任务：预测局部 Q-score；(3) 对比学习：同类残基的不同立方体应有相似 embedding。</p><p><strong>下游应用</strong>：直接 plug-in 到 ModelAngelo / DeepTracer 替换氨基酸识别模块。也可独立作为冷冻电镜数据库的<em>残基类型检索</em>工具。</p>`,

      evaluation: `<ul><li><strong>每类准确率（per-class F1）</strong>：focus on 易混淆组（LEU/ILE/VAL, ASP/ASN, GLU/GLN, PHE/TYR）</li><li><strong>跨分辨率泛化</strong>：1.5–6 Å 分档报告</li><li><strong>对比基线</strong>：ModelAngelo 的内置识别器（Jamali 2024）, DeepTracer 序列推断</li><li><strong>下游影响</strong>：替换 ModelAngelo 的识别模块后，HMM 序列搜索的 top-1 hit 率提升多少</li></ul>`,
      evaluation_zh: `<ul><li><strong>每类准确率（per-class F1）</strong>：聚焦易混淆组（LEU/ILE/VAL, ASP/ASN, GLU/GLN, PHE/TYR）</li><li><strong>跨分辨率泛化</strong>：1.5–6 Å 分档报告</li><li><strong>对比基线</strong>：ModelAngelo 内置识别器 (Jamali 2024), DeepTracer 序列推断</li><li><strong>下游影响</strong>：替换 ModelAngelo 识别模块后，HMM 序列搜索 top-1 命中率提升多少</li></ul>`,

      publication: `<p><strong>目标期刊：Nature Communications / Nature Methods (technical brief)</strong>。卖点是"无需序列就能识别氨基酸"——对宏蛋白质组学、未知样品鉴定、PTM 检测意义重大。可以作为独立工具发表，也可以作为更大端到端工作的核心组件。</p><p><strong>工作量：3-4 人月</strong>。任务边界清晰，已有现成数据，预期短期出成果。</p>`,
      publication_zh: `<p><strong>目标期刊：Nature Communications / Nature Methods (technical brief)</strong>。卖点是"无需序列就能识别氨基酸"——对宏蛋白质组学、未知样品鉴定、PTM 检测意义重大。可作为独立工具发表，也可作为更大端到端工作的核心组件。</p><p><strong>工作量：3-4 人月</strong>。任务边界清晰，数据已有，预期短期出成果。</p>`,

      risks: `<p>主要风险：低分辨率下相似残基难区分（生物学上限）。缓解：把它定位为"提供 top-k 候选 + 不确定性分数"，而非强制单一预测。这样下游 HMM 搜索仍可发挥作用。</p>`,
      risks_zh: `<p>主要风险：低分辨率下相似残基难区分（生物学上限）。缓解：定位为"提供 top-k 候选 + 不确定性分数"，而非强制单一预测，下游 HMM 搜索仍能发挥作用。</p>`,

      tags: ['3D ViT', 'Contrastive Learning', 'Plug-in to ModelAngelo', '3-4 person-months', 'Nature Communications']
    },

    {
      title_en: "Backbone Tracing at Sub-Optimal Resolution (4–8 Å)",
      title_zh: "次优分辨率（4-8 Å）的骨架追踪",
      summary_en: "Trace C-alpha backbones from low-resolution maps where current de novo methods completely fail.",
      summary_zh: "在现有 de novo 方法完全失效的低分辨率密度图中追踪 CA 骨架。",

      problem: `<p>According to the literature (Beyond Current Boundaries, arXiv 2024.10), the efficacy of DeepTracer and ModelAngelo <strong>"notably diminishes with low-resolution maps beyond 4 Å"</strong>. DEMO-EM and DiffModeler (PMC 2024) partially address this by combining AlphaFold-predicted structures, but they require pre-existing models — useless for novel proteins.</p><p>Meanwhile, <strong>~30% of EMDB entries have resolution worse than 4 Å</strong> and remain effectively unmodellable. Lots of biologically critical assemblies (e.g., ribosomes during translation, membrane complexes, large viruses) are routinely solved at 5-7 Å but never receive atomic models.</p>`,
      problem_zh: `<p>根据文献 (arXiv 2024.10) ，DeepTracer 和 ModelAngelo <strong>"在 4 Å 以下分辨率显著退化"</strong>。DEMO-EM 和 DiffModeler (PMC 2024) 部分通过结合 AlphaFold 预测的结构来缓解，但需要现成模型 —— 对新蛋白质完全无效。</p><p><strong>EMDB 中约 30% 的条目分辨率差于 4 Å</strong>，几乎无法建模。许多生物学关键组装体（如翻译中的核糖体、膜复合物、大病毒）通常在 5-7 Å 解出，但从未获得原子模型。</p>`,

      approach: `<p>策略：<strong>不直接预测原子，而是分两步</strong> —— (1) 从密度图预测骨架"链条"（连续 CA 路径），(2) 用 AlphaFold-Multimer/AF3 提供的预测模型做柔性 fit。</p><p>关键创新：<strong>用 Plan A 的 <code>label_segment</code> + <code>label_chain</code> 训练"链感知骨架追踪器"</strong>，输出多链 CA 路径，每条路径有链 ID。这比 DEMO-EM 用结构 fit 更好，因为不需要预测模型。</p><p><strong>架构</strong>：3D U-Net（多尺度感受野）+ Transformer 头部（追踪路径，类似 NLP 序列标注）。引入 <strong>chain consistency loss</strong>：同链 CA 应有连续编号，跨链应有明显间断。</p>`,
      approach_zh: `<p>策略：<strong>不直接预测原子，而是分两步</strong> —— (1) 从密度图预测骨架"链条"（连续 CA 路径），(2) 用 AlphaFold-Multimer/AF3 预测模型做柔性 fit。</p><p>关键创新：<strong>用 Plan A 的 <code>label_segment</code> + <code>label_chain</code> 训练"链感知骨架追踪器"</strong>，输出多链 CA 路径，每条路径带链 ID。这比 DEMO-EM 的结构 fit 更好，因为不依赖预测模型。</p><p><strong>架构</strong>：3D U-Net（多尺度感受野）+ Transformer 头（类似 NLP 序列标注追踪路径）。引入<strong>链一致性 loss</strong>：同链 CA 应连续编号，跨链应有明显断点。</p>`,

      evaluation: `<ul><li><strong>Benchmark</strong>：构建专门的"次优分辨率"测试集：EMDB 中 4-8 Å 的 50 个条目</li><li><strong>指标</strong>：CA RMSD, 链分配准确率, completeness</li><li><strong>对比</strong>：DEMO-EM (Nat Comput Sci 2022), MICA (2025), DiffModeler 在 5+ Å</li></ul>`,
      evaluation_zh: `<ul><li><strong>Benchmark</strong>：构建专门的"次优分辨率"测试集：EMDB 中 4-8 Å 的 50 个条目</li><li><strong>指标</strong>：CA RMSD、链分配准确率、completeness</li><li><strong>对比</strong>：DEMO-EM (Nat Comput Sci 2022)、MICA (2025)、DiffModeler 在 5+ Å</li></ul>`,

      publication: `<p><strong>目标期刊：Nature Communications / Nature Computational Science</strong>。卖点是"开启 4-8 Å 区间的 model building"，让数千个之前无法建模的 cryo-EM 条目变得可用。这是 cryo-EM 社区的长期痛点。</p><p><strong>工作量：4-6 人月</strong>。</p>`,
      publication_zh: `<p><strong>目标期刊：Nature Communications / Nature Computational Science</strong>。卖点是"开启 4-8 Å 区间的 model building"，让数千个之前无法建模的冷冻电镜条目可用。这是社区长期痛点。</p><p><strong>工作量：4-6 人月</strong>。</p>`,

      risks: `<p>主要风险：低分辨率下 CA 位置本身不精确，"链分配"可能 ambiguous。缓解：输出多个候选 + 置信度，让下游 fitting 步骤选择。</p>`,
      risks_zh: `<p>主要风险：低分辨率下 CA 位置本身不精确，"链分配"可能模糊。缓解：输出多候选 + 置信度，让下游 fitting 步骤选择。</p>`,

      tags: ['Backbone Tracing', 'Multi-Chain', '4-6 person-months', 'Nature Communications']
    },

    {
      title_en: "End-to-End Map → Sequence + Structure (Density Transformer)",
      title_zh: "端到端密度图 → 序列 + 结构（密度 Transformer）",
      summary_en: "Train a single transformer that jointly outputs sequence, secondary structure, and CA positions from raw density — the cryo-EM analog of ESM-3.",
      summary_zh: "训练单一 Transformer，从原始密度图联合输出序列、二级结构和 CA 位置 —— 冷冻电镜版的 ESM-3。",

      problem: `<p>Current pipelines are <strong>sequential and brittle</strong>: density → backbone → residue identification → sequence search → model building. Each step propagates errors. The <strong>MICA paper (bioRxiv 2025)</strong> noted that "current integration is typically at the output level" — AlphaFold predicted structures only used in post-processing.</p><p>No model directly produces a <strong>joint distribution over (sequence, structure)</strong> conditioned on density. AlphaFold 3 went the other direction: sequence → structure, but cannot use density as a strong constraint.</p>`,
      problem_zh: `<p>当前流水线<strong>串行且脆弱</strong>：密度 → 骨架 → 残基识别 → 序列搜索 → 模型构建。每步误差累积。<strong>MICA (bioRxiv 2025)</strong> 指出"当前整合通常在输出层" —— AlphaFold 预测结构只用于后处理。</p><p>没有模型直接产生<strong>给定密度的 (序列, 结构) 联合分布</strong>。AlphaFold 3 走反方向：序列 → 结构，无法把密度作为强约束。</p>`,

      approach: `<p>训练一个 <strong>Density Transformer</strong>：</p><ul><li>输入：3D 密度立方体（分块成 patch）</li><li>输出 1：序列 token stream（自回归解码 + beam search）</li><li>输出 2：每个残基的 (x, y, z, ϕ, ψ, ω, sstype)</li></ul><p>用 Plan A 的 <code>label_aa</code> + <code>label_ss</code> + <code>label_atom</code>（CA 坐标可从中提取）联合监督。架构借鉴 <strong>ESM-3 (Hayes et al. 2024)</strong> 的多任务设计，但 backbone 改为 3D。</p><p>训练技巧：(1) <strong>multi-task curriculum</strong> 先训 SS（最容易），再加 aa，再加坐标；(2) <strong>scale-aware tokenization</strong>：低分辨率用大 patch，高分辨率用小 patch；(3) 用 <code>label_qscore</code> 做 confidence-aware loss。</p>`,
      approach_zh: `<p>训练一个 <strong>Density Transformer</strong>：</p><ul><li>输入：3D 密度立方体（分 patch）</li><li>输出 1：序列 token 流（自回归解码 + beam search）</li><li>输出 2：每残基 (x, y, z, ϕ, ψ, ω, sstype)</li></ul><p>用 Plan A 的 <code>label_aa</code> + <code>label_ss</code> + <code>label_atom</code>（CA 坐标可提取）联合监督。架构借鉴 <strong>ESM-3 (Hayes et al. 2024)</strong> 的多任务设计，主干改为 3D。</p><p>训练技巧：(1) <strong>多任务课程</strong>：先训 SS（最易），再加 aa，再加坐标；(2) <strong>尺度感知 tokenization</strong>：低分辨率用大 patch，高分辨率用小 patch；(3) 用 <code>label_qscore</code> 做置信度感知 loss。</p>`,

      evaluation: `<ul><li><strong>序列指标</strong>：sequence identity to ground truth（per-chain）, top-1 / top-5 HMM hit rate</li><li><strong>结构指标</strong>：CA RMSD, TM-score, GDT-TS</li><li><strong>联合指标</strong>：correlated accuracy（序列对的同时结构也对）</li><li><strong>对比</strong>：ModelAngelo, MICA, sequential pipelines</li></ul>`,
      evaluation_zh: `<ul><li><strong>序列指标</strong>：与真值序列一致性（每链）、top-1/top-5 HMM 命中率</li><li><strong>结构指标</strong>：CA RMSD、TM-score、GDT-TS</li><li><strong>联合指标</strong>：相关准确率（序列对的同时结构也对）</li><li><strong>对比</strong>：ModelAngelo、MICA、串行流水线</li></ul>`,

      publication: `<p><strong>目标期刊：Nature Methods / Nature</strong>。如果做成 ESM-3 级别的 cryo-EM 多模态基础模型，可冲 Nature 主刊（毕竟 ESM-3 在 Science，AlphaFold 在 Nature）。</p><p><strong>工作量：12-18 人月</strong>。这是大工程，但回报巨大。</p>`,
      publication_zh: `<p><strong>目标期刊：Nature Methods / Nature</strong>。如果做成 ESM-3 级别的冷冻电镜多模态基础模型，可冲 Nature 主刊（ESM-3 在 Science，AlphaFold 在 Nature）。</p><p><strong>工作量：12-18 人月</strong>。这是大工程，但回报巨大。</p>`,

      risks: `<ul><li>自回归序列生成在 3D 输入上不稳定 → 用 non-autoregressive 解码器</li><li>训练成本高 → 用 LoRA-style 微调或先做小规模 proof-of-concept</li><li>评测复杂 → 分阶段：先证 SS 准确，再加 aa，最后联合</li></ul>`,
      risks_zh: `<ul><li>自回归序列生成在 3D 输入上不稳定 → 用非自回归解码器</li><li>训练成本高 → 用 LoRA 风格微调或先做小规模可行性验证</li><li>评测复杂 → 分阶段：先证 SS 准确，再加 aa，最后联合</li></ul>`,

      tags: ['Multimodal Foundation Model', 'ESM-3-style', '12-18 person-months', 'Nature']
    }
  ],

  // ════════════════════════════════════════════════════════
  // DIRECTION 2: Map Denoising & Resolution Enhancement
  // ════════════════════════════════════════════════════════
  denoising: [
    {
      title_en: "Truly-Supervised Cryo-EM Denoising (Beyond Noise2Noise)",
      title_zh: "真监督冷冻电镜去噪（超越 Noise2Noise）",
      summary_en: "Plan A provides the first large-scale 'noisy → clean' supervised training pairs, breaking the Noise2Noise paradigm that has dominated cryo-EM denoising.",
      summary_zh: "Plan A 提供首个大规模'噪声→干净'监督训练对，打破长期主导冷冻电镜去噪的 Noise2Noise 范式。",

      problem: `<p>The current SOTA cryo-EM denoising tools — <strong>Topaz-Denoise</strong> (Bepler et al., <em>Nat Commun</em> 2020), <strong>CryoCARE</strong>, <strong>Warp</strong>, <strong>DeepDeWedge</strong> — all rely on the <strong>Noise2Noise paradigm</strong>: train on paired noisy observations (even/odd movie-frame splits or half-tomograms). They <em>"do not require ground truth data"</em> — because <em>there is no ground truth available</em>.</p><p>This causes fundamental limitations: (1) residual texture artifacts that look like real density; (2) inability to learn structure-conditioned denoising priors; (3) cannot extrapolate beyond observed noise statistics; (4) the SNR of cryo-EM micrographs is estimated at <strong>only ~0.11</strong>, so even good N2N denoisers cannot recover features genuinely below noise floor.</p>`,
      problem_zh: `<p>当前 SOTA 冷冻电镜去噪工具 —— <strong>Topaz-Denoise</strong> (Bepler et al., <em>Nat Commun</em> 2020)、<strong>CryoCARE</strong>、<strong>Warp</strong>、<strong>DeepDeWedge</strong> —— 全部依赖 <strong>Noise2Noise 范式</strong>：在配对的噪声观测上训练（even/odd 电影帧拆分或 half-tomograms）。它们<em>"无需真值数据"</em> —— 因为<em>根本没有真值可用</em>。</p><p>这导致根本性限制：(1) 残留纹理伪影类似真实密度；(2) 无法学习结构条件去噪先验；(3) 无法外推到训练噪声分布之外；(4) 冷冻电镜显微图 SNR 估计仅 <strong>~0.11</strong>，再好的 N2N 也无法恢复真正低于噪声基底的特征。</p>`,

      approach: `<p>Plan A 提供首个大规模 <strong>(实验噪声密度图, ChimeraX 完美模拟密度图)</strong> 配对集：11,000+ 对，跨 1-6 Å 全分辨率，<strong>分辨率档分级</strong>。这突破了 N2N 的根本限制。</p><p><strong>架构：</strong>3D U-Net + 残差连接 + perceptual loss（在 Plan A 训练好的 segment/atom 标签器的中间层提取 perceptual feature）。</p><p><strong>训练策略：</strong>(1) <strong>分辨率分档训练</strong>：低分辨率用更强 prior（更多模糊），高分辨率用细节保留 loss；(2) <strong>Q-score weighted loss</strong>：在高 Q-score 区域更严格监督；(3) 加入 <strong>structure-aware adversarial loss</strong>：让去噪输出在 segment/atom 分类器下识别为蛋白质特征，避免 hallucination。</p>`,
      approach_zh: `<p>Plan A 提供首个大规模 <strong>(实验噪声密度图, ChimeraX 完美模拟密度图)</strong> 配对集：11,000+ 对，跨 1-6 Å 全分辨率，<strong>分辨率分档</strong>。突破了 N2N 的根本限制。</p><p><strong>架构：</strong>3D U-Net + 残差连接 + 感知损失（在 Plan A 训练好的 segment/atom 标签器中间层提取感知特征）。</p><p><strong>训练策略：</strong>(1) <strong>分辨率分档训练</strong>：低分辨率用更强先验（更多模糊），高分辨率用细节保留 loss；(2) <strong>Q-score 加权 loss</strong>：高 Q-score 区域更严格监督；(3) 加入<strong>结构感知对抗 loss</strong>：让去噪输出在 segment/atom 分类器下被识别为蛋白质特征，避免幻觉。</p>`,

      evaluation: `<ul><li><strong>指标</strong>：PSNR / SSIM (vs ChimeraX simulated)、Q-score 提升、FSC 改善、EMRinger 提升</li><li><strong>对比</strong>：Topaz-Denoise (Nat Commun 2020), CryoCARE, DeepEMhancer (Comm Biol 2021), EMReady2 (bioRxiv 2025)</li><li><strong>Downstream</strong>：用去噪后的图跑 ModelAngelo，看 model building 准确率是否提升</li><li><strong>Hallucination check</strong>：去噪输出是否引入了真实结构中不存在的特征（critical for ethical AI）</li></ul>`,
      evaluation_zh: `<ul><li><strong>指标</strong>：PSNR/SSIM (vs ChimeraX 模拟)、Q-score 提升、FSC 改善、EMRinger 提升</li><li><strong>对比</strong>：Topaz-Denoise (Nat Commun 2020)、CryoCARE、DeepEMhancer (Comm Biol 2021)、EMReady2 (bioRxiv 2025)</li><li><strong>下游</strong>：用去噪后的图跑 ModelAngelo，model building 准确率是否提升</li><li><strong>幻觉检查</strong>：去噪输出是否引入真实结构不存在的特征（伦理 AI 关键）</li></ul>`,

      publication: `<p><strong>目标期刊：Nature Methods</strong>。这是 cryo-EM 数据处理的根本性范式转换 —— Topaz-Denoise 当年发表于 <em>Nat Commun</em>，DeepEMhancer 在 <em>Comm Biol</em>。我们如果能展示"突破 N2N 限制"，是该领域的标志性工作。</p><p><strong>工作量：4-6 人月</strong>。架构简单（3D U-Net），核心创新在数据。</p>`,
      publication_zh: `<p><strong>目标期刊：Nature Methods</strong>。这是冷冻电镜数据处理的根本范式转换 —— Topaz-Denoise 当年发于 <em>Nat Commun</em>，DeepEMhancer 在 <em>Comm Biol</em>。展示"突破 N2N 限制"将是该领域标志性工作。</p><p><strong>工作量：4-6 人月</strong>。架构简单（3D U-Net），核心创新在数据。</p>`,

      risks: `<p>ChimeraX 模拟与真实噪声分布不同 → 用 mixture training：N2N + 我们的监督联合训练。</p>`,
      risks_zh: `<p>ChimeraX 模拟与真实噪声分布不同 → 用混合训练：N2N + 我们的监督联合训练。</p>`,

      tags: ['Supervised Denoising', '3D U-Net', '4-6 person-months', 'Nature Methods']
    },

    {
      title_en: "Cross-Resolution Super-Resolution via Conditional Diffusion",
      title_zh: "基于条件扩散的跨分辨率超分辨",
      summary_en: "Use diffusion models to push 4-6 Å maps to 2-3 Å effective resolution, conditioned on target resolution as input.",
      summary_zh: "用扩散模型将 4-6 Å 密度图推到 2-3 Å 有效分辨率，以目标分辨率为条件输入。",

      problem: `<p><strong>EMReady2 (bioRxiv 2025)</strong> uses Mamba-based U-Net for cryo-EM map improvement. <strong>CryoTEN (Bioinformatics 2025)</strong> uses transformers. <strong>DiffModeler (PMC 2024)</strong> uses DDIM for backbone tracing at intermediate resolution. But none of these are <em>conditional</em> on target resolution. They are single-task models trained on specific resolution ranges.</p><p>The cryo-EM community routinely encounters maps at 4-6 Å where atomic features are smeared together. A <strong>resolution-conditional generator</strong> would allow users to specify "show me what this map would look like at 2.5 Å" — invaluable for visualization, model fitting, and follow-up experimental design.</p>`,
      problem_zh: `<p><strong>EMReady2 (bioRxiv 2025)</strong> 用 Mamba-based U-Net 改善冷冻电镜图。<strong>CryoTEN (Bioinformatics 2025)</strong> 用 transformer。<strong>DiffModeler (PMC 2024)</strong> 用 DDIM 做中等分辨率骨架追踪。但都不是<em>分辨率条件的</em>，都是特定分辨率范围的单任务模型。</p><p>冷冻电镜社区常遇到 4-6 Å 图，原子特征模糊。<strong>分辨率条件生成器</strong>能让用户指定"把这个图变成 2.5 Å 的样子"——对可视化、模型拟合、后续实验设计极有价值。</p>`,

      approach: `<p><strong>条件 latent diffusion</strong>：</p><ul><li>VAE 编码 3D 密度图到 latent space</li><li>扩散模型在 latent space 训练，conditioning on 输入 (低分辨率 latent) + target resolution scalar + cell parameters</li><li>解码回 3D 密度</li></ul><p>关键创新：Plan A 提供<strong>跨分辨率配对</strong>——同一蛋白质在不同分辨率的多个 EMDB 条目。可以训练"4 Å → 2 Å"、"6 Å → 3 Å"等映射。</p><p><strong>Flow Matching</strong> 替代 DDIM 加速推理（推理时间从 50 步降到 5 步）。</p>`,
      approach_zh: `<p><strong>条件 latent diffusion</strong>：</p><ul><li>VAE 把 3D 密度图编码到 latent 空间</li><li>扩散模型在 latent 空间训练，条件为（低分辨率 latent）+ 目标分辨率标量 + 晶胞参数</li><li>解码回 3D 密度</li></ul><p>关键创新：Plan A 提供<strong>跨分辨率配对</strong> —— 同一蛋白质在不同分辨率的多个 EMDB 条目。可以训练"4 Å → 2 Å"、"6 Å → 3 Å"等映射。</p><p><strong>Flow Matching</strong> 替代 DDIM 加速推理（从 50 步降到 5 步）。</p>`,

      evaluation: `<ul><li><strong>合成实验</strong>：取 Gold tier (1.5-2.5 Å) 条目，人工降分辨率到 4-5 Å，看模型能否恢复</li><li><strong>真实实验</strong>：用 Plan A 中同一蛋白多个分辨率的条目对，看预测的高分辨率图与真实高分辨率图的 FSC、Q-score 一致性</li><li><strong>对比</strong>：EMReady2 (Mamba)、CryoTEN (Transformer)、DeepEMhancer</li></ul>`,
      evaluation_zh: `<ul><li><strong>合成实验</strong>：取 Gold tier (1.5-2.5 Å) 条目，人为降分辨率到 4-5 Å，看模型能否恢复</li><li><strong>真实实验</strong>：用 Plan A 中同一蛋白多分辨率条目对，看预测的高分辨率图与真实高分辨率图的 FSC、Q-score 一致性</li><li><strong>对比</strong>：EMReady2 (Mamba)、CryoTEN (Transformer)、DeepEMhancer</li></ul>`,

      publication: `<p><strong>目标：Nature Methods</strong>。Diffusion-based 超分辨在 cryo-EM 是热门方向（DiffModeler 已发，但仅 backbone）。一个 general-purpose resolution-conditional generator 比 task-specific 工具更通用，更可能突破到 Nat Methods。</p><p><strong>工作量：6-9 人月</strong>。扩散模型训练较慢，需要 GPU 资源。</p>`,
      publication_zh: `<p><strong>目标：Nature Methods</strong>。基于扩散的超分辨在冷冻电镜是热门（DiffModeler 已发，但只做骨架）。一个通用的分辨率条件生成器比专用工具更通用，更可能冲 Nat Methods。</p><p><strong>工作量：6-9 人月</strong>。扩散模型训练慢，需 GPU 资源。</p>`,

      risks: `<p>幻觉风险：模型可能"编造"高分辨率细节。缓解：(1) 用 PHENIX CC 作为评测标准（不只是 PSNR）；(2) 输出 uncertainty map；(3) 严格区分"显示用"和"建模用"两种 mode。</p>`,
      risks_zh: `<p>幻觉风险：模型可能"编造"高分辨率细节。缓解：(1) 用 PHENIX CC 作为评测标准（不只是 PSNR）；(2) 输出不确定性图；(3) 严格区分"显示用"和"建模用"两种模式。</p>`,

      tags: ['Latent Diffusion', 'Flow Matching', '6-9 person-months', 'Nature Methods']
    },

    {
      title_en: "Q-Score Guided Local Sharpening (Map-MD Hybrid)",
      title_zh: "Q-score 引导的局部锐化（Map-MD 混合）",
      summary_en: "Use Plan A's per-atom Q-scores to drive spatially-varying sharpening: high-confidence regions get aggressive enhancement; low-confidence regions remain conservative.",
      summary_zh: "利用 Plan A 的每原子 Q-score 驱动空间变化锐化：高置信区强力增强，低置信区保守处理。",

      problem: `<p>Standard sharpening (B-factor based, e.g., <code>relion_postprocess</code>) applies <strong>uniform</strong> sharpening across the map. <strong>DeepEMhancer (Comm Biol 2021)</strong> learns to sharpen but cannot exploit per-residue confidence. <strong>EMReady2</strong> uses "local resolution-guided" learning but no per-atom granularity.</p><p>Real cryo-EM maps have <strong>highly heterogeneous local quality</strong>: flexible regions (loops, termini, surface) are blurred; rigid cores are sharp. Uniform sharpening over-enhances noise in blurred regions and under-enhances rigid cores.</p>`,
      problem_zh: `<p>标准锐化（基于 B 因子，如 <code>relion_postprocess</code>）对整图<strong>均匀</strong>锐化。<strong>DeepEMhancer (Comm Biol 2021)</strong> 学习锐化但无法利用每残基置信度。<strong>EMReady2</strong> 用"局部分辨率引导"学习但没有每原子粒度。</p><p>真实冷冻电镜图<strong>局部质量高度异质</strong>：柔性区（loop、末端、表面）模糊，刚性核心锐利。均匀锐化在模糊区放大噪声，在刚性核心欠增强。</p>`,

      approach: `<p>用 Plan A 的 <code>label_qscore</code>（每个 backbone 原子的密度拟合置信度）作为<strong>空间调制信号</strong>：</p><ol><li>预测每个体素的 sharpening factor（高 Q-score → 高 factor，低 Q-score → 保守）</li><li>用 attention 机制让相邻体素的 factor 平滑过渡</li><li>训练时用 ChimeraX simulated map 做监督</li></ol><p>额外创新：输出<strong>分级 sharpening levels</strong>（low/medium/aggressive），让用户根据下游任务选择。</p>`,
      approach_zh: `<p>用 Plan A 的 <code>label_qscore</code>（每个骨架原子的密度拟合置信度）作为<strong>空间调制信号</strong>：</p><ol><li>预测每体素的锐化因子（高 Q-score → 高因子，低 Q-score → 保守）</li><li>用注意力机制让相邻体素因子平滑过渡</li><li>训练时用 ChimeraX 模拟图监督</li></ol><p>额外创新：输出<strong>分级锐化等级</strong>（low/medium/aggressive），用户按下游任务选择。</p>`,

      evaluation: `<ul><li><strong>指标</strong>：局部 Q-score 提升、局部 EMRinger 分数、model-map FSC at different shells</li><li><strong>用户研究</strong>：让 3 位 cryo-EM 专家盲评 sharpened maps 的可视质量</li><li><strong>对比</strong>：DeepEMhancer, EMReady2, relion_postprocess</li></ul>`,
      evaluation_zh: `<ul><li><strong>指标</strong>：局部 Q-score 提升、局部 EMRinger 分数、不同壳层的模型-图 FSC</li><li><strong>用户研究</strong>：3 位冷冻电镜专家盲评锐化后图的可视质量</li><li><strong>对比</strong>：DeepEMhancer、EMReady2、relion_postprocess</li></ul>`,

      publication: `<p><strong>目标：Bioinformatics / Acta Crystallographica D / Cell Reports Methods</strong>。是个高 utility 的实用工具，发表门槛比上面方向低，但对 cryo-EM 实验社区价值大。</p><p><strong>工作量：2-3 人月</strong>。轻量级项目，可作为预研。</p>`,
      publication_zh: `<p><strong>目标：Bioinformatics / Acta Crystallographica D / Cell Reports Methods</strong>。高实用性工具，发表门槛比上面方向低，但对实验社区价值大。</p><p><strong>工作量：2-3 人月</strong>。轻量级项目，可作为预研。</p>`,

      risks: `<p>风险低：是已有方法的"加 Q-score 条件"扩展，工程上容易实现。</p>`,
      risks_zh: `<p>风险低：是已有方法的"加 Q-score 条件"扩展，工程上易实现。</p>`,

      tags: ['Local Sharpening', 'Q-score Conditional', '2-3 person-months', 'Bioinformatics']
    }
  ],

  // ════════════════════════════════════════════════════════
  // DIRECTION 3: Interface & Assembly Prediction
  // ════════════════════════════════════════════════════════
  interface: [
    {
      title_en: "Density-to-Interface Prediction (Before Model Building)",
      title_zh: "密度直接预测界面（建模前）",
      summary_en: "First model that predicts protein-protein interfaces directly from cryo-EM density, without requiring an atomic model.",
      summary_zh: "首个直接从冷冻电镜密度预测蛋白-蛋白界面的模型，无需原子模型。",

      problem: `<p>All interface prediction methods to date require atomic coordinates: <strong>MaSIF (Gainza et al., <em>Nat Methods</em> 2020)</strong>, <strong>PInet</strong>, <strong>AlphaFold-Multimer (AFM)</strong>. AFM has serious limitations: <strong>only 60% of dimers are accurately predicted</strong>; on hard heteromeric interfaces only <strong>23% achieve high accuracy</strong>; on difficult CASP15 targets the MMscore was only 0.63.</p><p>For cryo-EM workflows, this means: even when a 5 Å map clearly shows oligomeric assembly, <strong>we cannot extract interface information until full atomic modeling is done</strong> — a months-long process. There is no large-scale "density → interface residue map" training data anywhere.</p>`,
      problem_zh: `<p>现有所有界面预测方法都需要原子坐标：<strong>MaSIF (Gainza et al., <em>Nat Methods</em> 2020)</strong>、<strong>PInet</strong>、<strong>AlphaFold-Multimer (AFM)</strong>。AFM 有严重局限：<strong>仅 60% 二聚体准确预测</strong>；难的异源界面仅 <strong>23% 达高精度</strong>；CASP15 难题 MMscore 仅 0.63。</p><p>对冷冻电镜工作流，这意味着：即使 5 Å 图清楚显示寡聚组装体，<strong>必须等完整原子建模完才能获取界面信息</strong>——耗时数月。任何地方都没有大规模"密度→界面残基图"训练数据。</p>`,

      approach: `<p>用 Plan A 的 <strong><code>label_interface</code>（11K 条目体素级二值界面标注）</strong> 训练 <strong>density → voxel-level interface probability</strong> 模型。这是首个此类配对数据集。</p><p><strong>架构</strong>：3D U-Net + attention 模块（捕捉长距离 cross-chain dependencies）。损失：focal loss（界面残基稀疏）+ chain-aware contrastive loss（鼓励同链残基的密度特征聚集，跨链残基排斥）。</p><p><strong>多任务扩展</strong>：同时输出 <code>label_interface</code> + <code>label_chain</code> + <code>label_segment</code> —— 三任务相互正则化。链分配明确后，界面识别自然涌现。</p>`,
      approach_zh: `<p>用 Plan A 的 <strong><code>label_interface</code>（11K 条目体素级二值界面标注）</strong> 训练 <strong>密度 → 体素级界面概率</strong>模型。首个此类配对数据集。</p><p><strong>架构</strong>：3D U-Net + 注意力模块（捕捉长程跨链依赖）。损失：focal loss（界面残基稀疏）+ 链感知对比 loss（鼓励同链残基的密度特征聚集，跨链排斥）。</p><p><strong>多任务扩展</strong>：同时输出 <code>label_interface</code> + <code>label_chain</code> + <code>label_segment</code> —— 三任务相互正则化。链分配明确后，界面识别自然涌现。</p>`,

      evaluation: `<ul><li><strong>体素级</strong>：interface AUC, F1, IoU</li><li><strong>残基级</strong>：聚合体素到 CA，计算 per-residue interface F1</li><li><strong>对比</strong>：(a) AFM 输出在密度图上做 fit 后提取的界面；(b) 简单距离阈值法</li><li><strong>下游应用</strong>：用预测的界面引导 ModelAngelo / MICA，看 model building 准确率提升</li></ul>`,
      evaluation_zh: `<ul><li><strong>体素级</strong>：界面 AUC、F1、IoU</li><li><strong>残基级</strong>：聚合体素到 CA，计算每残基界面 F1</li><li><strong>对比</strong>：(a) AFM 输出在密度图上 fit 后提取的界面；(b) 简单距离阈值法</li><li><strong>下游应用</strong>：用预测界面引导 ModelAngelo / MICA，看 model building 准确率提升</li></ul>`,

      publication: `<p><strong>目标：Nature Methods / Nature Communications</strong>。这是"density-only interface prediction"的开创工作 —— 此前完全不存在。MaSIF (Nat Methods 2020) 当年用 surface representations 实现"sequence-only → interface"，我们做"density-only → interface"是同等级别的工作。</p><p><strong>工作量：4-6 人月</strong>。</p>`,
      publication_zh: `<p><strong>目标：Nature Methods / Nature Communications</strong>。这是"仅用密度图做界面预测"的开创工作 —— 之前完全不存在。MaSIF (Nat Methods 2020) 当年用 surface 表示实现"仅用序列 → 界面"，我们做"仅用密度 → 界面"是同等级别。</p><p><strong>工作量：4-6 人月</strong>。</p>`,

      risks: `<p>低分辨率下界面残基不易区分（CA 模糊）。缓解：把 5+ Å 数据作为辅助评测，主结果聚焦 < 4 Å。</p>`,
      risks_zh: `<p>低分辨率下界面残基不易区分（CA 模糊）。缓解：5+ Å 数据作辅助评测，主结果聚焦 < 4 Å。</p>`,

      tags: ['Interface Prediction', '3D U-Net', '4-6 person-months', 'Nature Methods']
    },

    {
      title_en: "Oligomeric State from Mid-Resolution Density",
      title_zh: "中等分辨率密度的寡聚态识别",
      summary_en: "Predict oligomeric state (monomer / dimer / trimer / ...) directly from cryo-EM density at 4-8 Å resolution — useful in early-stage data analysis.",
      summary_zh: "直接从 4-8 Å 冷冻电镜密度预测寡聚态（单体/二聚体/三聚体...），用于早期数据分析。",

      problem: `<p>Determining oligomeric state from low-resolution maps is currently <strong>a manual judgment call</strong> by cryo-EM specialists. PISA (Krissinel 2007) requires atomic models. EMDB does record "deposited symmetry" but only after model building. <strong>For new data from electron microscopes, the oligomeric state is often unknown for weeks-months</strong> while model building proceeds.</p><p>Knowing oligomeric state early would dramatically accelerate cryo-EM workflows: choose right reference, apply symmetry constraints, identify potential contaminants. No automated tool exists.</p>`,
      problem_zh: `<p>从低分辨率图判断寡聚态目前是冷冻电镜专家<strong>人工判断</strong>。PISA (Krissinel 2007) 需要原子模型。EMDB 记录"沉积对称性"但只在建模后。<strong>电镜新数据的寡聚态在数周-数月内未知</strong>，直到模型构建完成。</p><p>早期知道寡聚态能极大加速冷冻电镜工作流：选对参考模型、加对称约束、识别污染。但没有自动工具。</p>`,

      approach: `<p>用 Plan A 的 <code>label_chain</code>（链分配，已展开到 bio-assembly）训练 <strong>density → oligomeric state classifier</strong>。每个条目的 ground truth 是其 bio-assembly 的链数（从 <code>labeling_stats.json</code> 提取的 <code>n_chains</code>）。</p><p><strong>架构</strong>：3D CNN（VGG/ResNet 风格）+ global pooling + classification head（输出 1-24+ 类，包括 "irregular/no-symmetry"）。</p><p><strong>多任务</strong>：同时预测点群对称性（C2, D3, T, O, I 等）。Plan A 的 bio-assembly 对称操作数可作为辅助标签。</p>`,
      approach_zh: `<p>用 Plan A 的 <code>label_chain</code>（链分配，已展开到生物组装体）训练 <strong>密度 → 寡聚态分类器</strong>。每个条目的真值是其生物组装体的链数（从 <code>labeling_stats.json</code> 的 <code>n_chains</code> 提取）。</p><p><strong>架构</strong>：3D CNN (VGG/ResNet 风格) + global pooling + 分类头（输出 1-24+ 类，含"不规则/无对称"）。</p><p><strong>多任务</strong>：同时预测点群对称性（C2、D3、T、O、I 等）。Plan A 的生物组装体对称操作数可作辅助标签。</p>`,

      evaluation: `<ul><li><strong>主指标</strong>：Top-1 / Top-3 准确率</li><li><strong>稳健性</strong>：在 4 Å, 5 Å, 6 Å, 8 Å 分别测</li><li><strong>对照</strong>：(a) PISA on atomic model（理想上限），(b) cryoSPARC 的 "Symmetry Search" 工具</li><li><strong>速度</strong>：单条目推理 < 5 秒</li></ul>`,
      evaluation_zh: `<ul><li><strong>主指标</strong>：Top-1 / Top-3 准确率</li><li><strong>稳健性</strong>：4 Å、5 Å、6 Å、8 Å 分别测</li><li><strong>对照</strong>：(a) PISA 基于原子模型（理论上限），(b) cryoSPARC 的"对称搜索"工具</li><li><strong>速度</strong>：单条目推理 < 5 秒</li></ul>`,

      publication: `<p><strong>目标：JCIM / Bioinformatics / Acta Crystallographica D</strong>。实用工具型工作，发表门槛中等。可以做成 web service 让 EMDB 整合，那就提到 <strong>Nature Communications</strong>。</p><p><strong>工作量：2-3 人月</strong>。</p>`,
      publication_zh: `<p><strong>目标：JCIM / Bioinformatics / Acta Crystallographica D</strong>。实用工具型工作，发表门槛中等。如做成 web service 让 EMDB 整合，能冲 <strong>Nature Communications</strong>。</p><p><strong>工作量：2-3 人月</strong>。</p>`,

      risks: `<p>类别不均衡（dimer 多，T/I 对称少）→ 用 class-balanced sampling 或 focal loss。</p>`,
      risks_zh: `<p>类别不均衡（二聚体多，T/I 对称少）→ 用类别平衡采样或 focal loss。</p>`,

      tags: ['Classification', 'Oligomeric State', '2-3 person-months', 'Bioinformatics']
    },

    {
      title_en: "Cryo-EM Surface Fingerprint (Density-MaSIF)",
      title_zh: "冷冻电镜表面指纹（密度版 MaSIF）",
      summary_en: "Build a 'MaSIF for cryo-EM' — learn density-based surface fingerprints for protein interaction prediction without atomic models.",
      summary_zh: "构建'冷冻电镜版 MaSIF'——学习基于密度的表面指纹，无需原子模型即可预测蛋白相互作用。",

      problem: `<p><strong>MaSIF (Gainza et al., <em>Nat Methods</em> 2020)</strong> learns molecular surface fingerprints from <em>atomic models</em> via geometric deep learning. It is widely used for ligand-binding and protein-protein interaction prediction. But MaSIF cannot operate on cryo-EM density directly.</p><p>For protein engineering, drug discovery, and de novo protein design, having <strong>surface descriptors directly from density</strong> would allow finding binders/inhibitors in early-stage cryo-EM data, before atomic models exist.</p>`,
      problem_zh: `<p><strong>MaSIF (Gainza et al., <em>Nat Methods</em> 2020)</strong> 通过几何深度学习从<em>原子模型</em>学习分子表面指纹，广泛用于配体结合与蛋白相互作用预测。但 MaSIF 无法直接在冷冻电镜密度上工作。</p><p>对蛋白工程、药物发现、de novo 蛋白设计，<strong>直接从密度获取表面描述符</strong>能在没有原子模型时就发现 binder / 抑制剂，价值巨大。</p>`,

      approach: `<p>训练 <strong>Density Surface Encoder</strong>：</p><ol><li>从 Plan A 的 <code>label_segment</code> 提取蛋白表面（segment=1 的外边界）</li><li>在每个表面 patch 上学习 fingerprint（用 PointNet++ 或 3D Transformer）</li><li>用 <code>label_interface</code> 作为对比学习信号：界面 patch 应有"互补"指纹</li><li>用 <code>label_aa</code> + <code>label_qscore</code> 辅助监督</li></ol><p><strong>下游任务</strong>：(a) interface site detection，(b) binding pocket search，(c) protein-protein matching（"找密度图中可能与给定蛋白结合的位置"）。</p>`,
      approach_zh: `<p>训练 <strong>密度表面编码器</strong>：</p><ol><li>从 Plan A 的 <code>label_segment</code> 提取蛋白表面（segment=1 的外边界）</li><li>在每个表面 patch 学习 fingerprint（PointNet++ 或 3D Transformer）</li><li>用 <code>label_interface</code> 做对比学习信号：界面 patch 应有"互补"指纹</li><li>用 <code>label_aa</code> + <code>label_qscore</code> 辅助监督</li></ol><p><strong>下游任务</strong>：(a) 界面位点检测；(b) 结合口袋搜索；(c) 蛋白-蛋白匹配（"在密度图中找可能与给定蛋白结合的位置"）。</p>`,

      evaluation: `<ul><li>跟 MaSIF（基于原子模型，理论上限）对比</li><li>在 EMDB 中找候选 binding site，用药物化学家盲测</li><li>下游应用 metrics：binder ranking AUC</li></ul>`,
      evaluation_zh: `<ul><li>跟 MaSIF（基于原子模型，理论上限）对比</li><li>在 EMDB 中找候选结合位点，让药物化学家盲测</li><li>下游应用指标：binder 排序 AUC</li></ul>`,

      publication: `<p><strong>目标：Nature Methods / Nature Communications</strong>。MaSIF 当年发 <em>Nat Methods</em>，Density-MaSIF 是平行级别的工作。也可以打入<strong>Drug Discovery Today</strong> 或 <strong>Cell Chemical Biology</strong> 的应用层。</p><p><strong>工作量：6-9 人月</strong>。</p>`,
      publication_zh: `<p><strong>目标：Nature Methods / Nature Communications</strong>。MaSIF 当年发 <em>Nat Methods</em>，密度版 MaSIF 是平行级别。也可冲 <strong>Drug Discovery Today</strong> 或 <strong>Cell Chemical Biology</strong> 的应用层。</p><p><strong>工作量：6-9 人月</strong>。</p>`,

      risks: `<p>表面提取在低分辨率下不稳定 → 用 Gold tier 条目作为主训练集。</p>`,
      risks_zh: `<p>表面提取在低分辨率下不稳定 → 用 Gold tier 条目作为主训练集。</p>`,

      tags: ['Surface Learning', 'MaSIF-style', '6-9 person-months', 'Nature Methods']
    }
  ],

  // ════════════════════════════════════════════════════════
  // DIRECTION 4: Density-Based Domain & Fold Discovery
  // ════════════════════════════════════════════════════════
  domain_fold: [
    {
      title_en: "Cryo-EM Density Domain Segmentation (Before Model Building)",
      title_zh: "冷冻电镜密度图结构域分割（建模前）",
      summary_en: "Segment structural domains directly from cryo-EM density — replacing Merizo's dependence on atomic models.",
      summary_zh: "直接从冷冻电镜密度图分割结构域 —— 替代 Merizo 对原子模型的依赖。",

      problem: `<p><strong>Merizo (Lau et al., <em>Nat Commun</em> 2023)</strong>, <strong>SWORD</strong>, <strong>UniDoc</strong>, <strong>DPAM (2023)</strong> are all SOTA domain segmentation methods, but they <em>all operate on atomic coordinates</em>. SWORD takes 1.7 hours on the CATH-663 set. None can operate directly on cryo-EM density.</p><p>For cryo-EM, this means domain analysis must wait until atomic modeling is done. <strong>DEMO-EM (Nat Comput Sci 2022)</strong> uses domains for assembly but requires predicted models. There is <strong>no method to predict domain boundaries from density alone</strong>.</p>`,
      problem_zh: `<p><strong>Merizo (Lau et al., <em>Nat Commun</em> 2023)</strong>、<strong>SWORD</strong>、<strong>UniDoc</strong>、<strong>DPAM (2023)</strong> 都是 SOTA 结构域分割方法，但<em>全部基于原子坐标</em>。SWORD 在 CATH-663 集合上需 1.7 小时。没有方法直接从冷冻电镜密度操作。</p><p>对冷冻电镜，这意味着结构域分析必须等建模完成。<strong>DEMO-EM (Nat Comput Sci 2022)</strong> 用 domain 做组装但需要预测模型。<strong>没有方法仅从密度预测结构域边界</strong>。</p>`,

      approach: `<p>训练 <strong>Density Domain Segmenter</strong>：</p><ol><li>用 Plan A 的 <code>label_domain</code>（11K bio-assemblies，已用 Merizo 标注并传播）作 ground truth</li><li>3D U-Net 输出每体素的 domain ID（实例分割任务，类似 Mask R-CNN）</li><li>用 <code>label_chain</code> 作为辅助 condition（同一链的 domain 应连续）</li></ol><p><strong>关键技术</strong>：domain boundary 通常对应 backbone 较模糊的 linker 区域。在 loss 设计上加 <strong>boundary-aware weighting</strong>。</p><p><strong>评估前所未有</strong>：直接对比 (我们 density-based 预测) vs (Merizo on built atomic model) —— 看是否能在中等分辨率密度上达到原子模型水平的 domain 分割。</p>`,
      approach_zh: `<p>训练 <strong>密度结构域分割器</strong>：</p><ol><li>用 Plan A 的 <code>label_domain</code>（11K 生物组装体，用 Merizo 标注并传播）作真值</li><li>3D U-Net 输出每体素的 domain ID（实例分割任务，类似 Mask R-CNN）</li><li>用 <code>label_chain</code> 作辅助 condition（同链 domain 应连续）</li></ol><p><strong>关键技术</strong>：domain 边界通常对应骨架较模糊的 linker 区域。loss 设计加<strong>边界感知加权</strong>。</p><p><strong>前所未有的评估</strong>：直接对比（我们的密度预测）vs（Merizo 基于建好的原子模型）—— 看能否在中等分辨率密度上达到原子模型级别的 domain 分割。</p>`,

      evaluation: `<ul><li><strong>Merizo 一致性</strong>：当原子模型存在时，跟 Merizo on PDB 的 IoU</li><li><strong>无原子模型情况</strong>：人工专家盲评 30 个 4-6 Å 条目</li><li><strong>下游应用</strong>：用预测 domain 指导 DEMO-EM-like 的多域组装</li></ul>`,
      evaluation_zh: `<ul><li><strong>Merizo 一致性</strong>：有原子模型时，跟 Merizo on PDB 的 IoU</li><li><strong>无原子模型情况</strong>：人工专家盲评 30 个 4-6 Å 条目</li><li><strong>下游应用</strong>：用预测 domain 指导 DEMO-EM 风格的多域组装</li></ul>`,

      publication: `<p><strong>目标：Nature Methods / Nature Communications</strong>。这是"density-only domain segmentation"的首作。Merizo 当年发 <em>Nat Commun</em>。</p><p><strong>工作量：4-6 人月</strong>。</p>`,
      publication_zh: `<p><strong>目标：Nature Methods / Nature Communications</strong>。这是"仅用密度做 domain segmentation"的首作。Merizo 当年发 <em>Nat Commun</em>。</p><p><strong>工作量：4-6 人月</strong>。</p>`,

      risks: `<p>Merizo 本身对 cryo-EM 模型可能不完美 → Q-score 过滤掉低质量 domain 标签。</p>`,
      risks_zh: `<p>Merizo 本身对冷冻电镜模型可能不完美 → 用 Q-score 过滤低质量 domain 标签。</p>`,

      tags: ['Instance Segmentation', 'Density-Only', '4-6 person-months', 'Nature Methods']
    },

    {
      title_en: "Cryo-Foldseek: Density-Based Fold Search",
      title_zh: "Cryo-Foldseek：基于密度的折叠搜索",
      summary_en: "A 'Foldseek for cryo-EM' — search the EMDB by density similarity, without requiring atomic models.",
      summary_zh: "'冷冻电镜版 Foldseek'——按密度相似度搜索 EMDB，无需原子模型。",

      problem: `<p><strong>Foldseek (van Kempen et al., <em>Nat Biotechnol</em> 2024)</strong> revolutionized structural homology search with 3Di alphabet encoding of atomic structures. <strong>Merizo-search (2025 Bioinformatics)</strong> combines Foldseek + Merizo for domain-level search. But both require <em>atomic structures</em>.</p><p>For cryo-EM, structural similarity search at the density level would enable: (a) finding similar structures in EMDB for new samples; (b) discovering structural homologs across different organisms; (c) detecting structural mimics in pathogens. No tool currently exists.</p>`,
      problem_zh: `<p><strong>Foldseek (van Kempen et al., <em>Nat Biotechnol</em> 2024)</strong> 用 3Di 字母表编码原子结构革命性地加速结构同源搜索。<strong>Merizo-search (Bioinformatics 2025)</strong> 结合 Foldseek + Merizo 做 domain 级搜索。但都需要<em>原子结构</em>。</p><p>对冷冻电镜，密度级结构相似度搜索能：(a) 为新样品在 EMDB 中找相似结构；(b) 发现跨物种结构同源；(c) 病原体的结构模仿检测。目前没有工具。</p>`,

      approach: `<p>训练 <strong>Density Encoder</strong>（contrastive learning）：</p><ol><li>取 Plan A 中相同 PDB ID 但不同 EMDB 条目的密度图作 positive pair</li><li>不同蛋白质作 negative pair</li><li>用 SimCLR / VICReg 框架学习 density embedding</li></ol><p><strong>关键</strong>：用 Plan A 的 <code>label_domain</code> 把全图编码改成 domain-level 编码 —— 类似 Merizo-search 在 atom 上做的。每个 domain 一个 embedding。</p><p><strong>检索系统</strong>：FAISS index + 11K × ~5 domains = 55K embedding 向量。查询时输入一个新 cryo-EM 密度图，输出 top-k 最相似的 domain。</p>`,
      approach_zh: `<p>训练 <strong>密度编码器</strong>（对比学习）：</p><ol><li>Plan A 中相同 PDB ID 但不同 EMDB 条目的密度图作 positive pair</li><li>不同蛋白质作 negative pair</li><li>用 SimCLR / VICReg 框架学习 density embedding</li></ol><p><strong>关键</strong>：用 Plan A 的 <code>label_domain</code> 把全图编码改成 domain 级 —— 类似 Merizo-search 在原子上做的。每 domain 一个 embedding。</p><p><strong>检索系统</strong>：FAISS index + 11K × ~5 domains = 55K embedding 向量。查询时输入新冷冻电镜密度图，输出 top-k 最相似 domain。</p>`,

      evaluation: `<ul><li><strong>CATH 一致性</strong>：top-k 检索结果的 CATH 同源率（如 Foldseek 评估）</li><li><strong>跨分辨率稳健性</strong>：同结构不同分辨率应该高相似度</li><li><strong>速度</strong>：百万次查询每分钟</li><li><strong>对比</strong>：传统 cryo-EM 相似度（real-space CC, FSC）</li></ul>`,
      evaluation_zh: `<ul><li><strong>CATH 一致性</strong>：top-k 检索结果的 CATH 同源率（Foldseek 风格评估）</li><li><strong>跨分辨率稳健性</strong>：同结构不同分辨率应高相似度</li><li><strong>速度</strong>：百万次查询/分钟</li><li><strong>对比</strong>：传统冷冻电镜相似度（实空间 CC、FSC）</li></ul>`,

      publication: `<p><strong>目标：Nature Biotechnology / Nature Methods</strong>。Foldseek 发 <em>Nat Biotechnol</em>。一个"Foldseek for cryo-EM"是结构生物学社区的杀手级工具。</p><p><strong>工作量：6-9 人月</strong>。</p>`,
      publication_zh: `<p><strong>目标：Nature Biotechnology / Nature Methods</strong>。Foldseek 发 <em>Nat Biotechnol</em>。"冷冻电镜版 Foldseek"是结构生物学社区的杀手级工具。</p><p><strong>工作量：6-9 人月</strong>。</p>`,

      risks: `<p>同 PDB 不同 EMDB 的对可能太少（EMDB 中真正重复样品不多）→ 用 data augmentation：人工降分辨率、加噪声生成 positive pair。</p>`,
      risks_zh: `<p>同 PDB 不同 EMDB 的对可能不多 → 用数据增强：人工降分辨率、加噪声生成 positive pair。</p>`,

      tags: ['Contrastive Learning', 'Structural Search', '6-9 person-months', 'Nature Biotechnology']
    },

    {
      title_en: "Density-to-Secondary-Structure (End-to-End SSP)",
      title_zh: "密度到二级结构（端到端 SSP）",
      summary_en: "Predict per-residue secondary structure from cryo-EM density without model building.",
      summary_zh: "无需建模，从冷冻电镜密度预测每残基二级结构。",

      problem: `<p>Secondary structure prediction from sequence (NetSurfP, Spider3, ESM-2) is mature but doesn't use cryo-EM data. From cryo-EM, current methods rely on visual inspection of helices/sheets in maps and assignment after model building.</p><p>For mid-resolution cryo-EM where atomic modeling is unreliable, <strong>even SS-level information would be valuable</strong> — telling experimentalists "this is an all-alpha protein" or "there's a beta-barrel here" guides downstream interpretation.</p>`,
      problem_zh: `<p>从序列预测二级结构（NetSurfP、Spider3、ESM-2）已成熟但不用冷冻电镜数据。从冷冻电镜，当前方法靠目视检查图中的螺旋/折叠并在建模后分配。</p><p>对中等分辨率冷冻电镜（原子建模不可靠时），<strong>即使是 SS 级信息也有价值</strong> —— 告诉实验者"这是全 α 蛋白"或"这里有个 β-桶"，指导后续解读。</p>`,

      approach: `<p>训练 <strong>density → per-voxel SS</strong> 模型：</p><ol><li>3D U-Net + auxiliary heads</li><li>用 Plan A 的 <code>label_ss</code>（CA-only, 3 类：H/S/C）作主监督</li><li>用 <code>label_segment</code> 做 region weighting（只在蛋白质区计算 loss）</li><li>引入 <strong>topology consistency loss</strong>：连续 helix 应有连续 H 预测，跨 strand 不能 abruptly change</li></ol><p><strong>多尺度评估</strong>：在 2 Å, 3 Å, 4 Å, 6 Å 分别测，看模型在哪里开始失效。</p>`,
      approach_zh: `<p>训练 <strong>密度 → 每体素 SS</strong> 模型：</p><ol><li>3D U-Net + 辅助头</li><li>用 Plan A 的 <code>label_ss</code>（CA-only，3 类：H/S/C）作主监督</li><li>用 <code>label_segment</code> 做区域加权（只在蛋白区算 loss）</li><li>引入<strong>拓扑一致性 loss</strong>：连续 helix 应有连续 H 预测，跨 strand 不能突变</li></ol><p><strong>多尺度评估</strong>：2 Å, 3 Å, 4 Å, 6 Å 分别测，看模型何时失效。</p>`,

      evaluation: `<ul><li><strong>每体素 SS 准确率</strong></li><li><strong>每残基（聚合到 CA）SS 准确率</strong>，跟 DSSP/STRIDE 比</li><li><strong>低分辨率边界</strong>：识别模型在哪个分辨率开始失效</li></ul>`,
      evaluation_zh: `<ul><li><strong>每体素 SS 准确率</strong></li><li><strong>每残基（聚合到 CA）SS 准确率</strong>，与 DSSP/STRIDE 比</li><li><strong>低分辨率边界</strong>：识别模型何时失效</li></ul>`,

      publication: `<p><strong>目标：Bioinformatics / Acta Crystallographica D / Nature Communications</strong>。基础模块工作，发表门槛中等但 utility 很高。</p><p><strong>工作量：2-3 人月</strong>。</p>`,
      publication_zh: `<p><strong>目标：Bioinformatics / Acta Crystallographica D / Nature Communications</strong>。基础模块工作，发表门槛中等但实用性高。</p><p><strong>工作量：2-3 人月</strong>。</p>`,

      risks: `<p>风险低。</p>`,
      risks_zh: `<p>风险低。</p>`,

      tags: ['Secondary Structure', 'Density-Only', '2-3 person-months', 'Bioinformatics']
    }
  ],

  // ════════════════════════════════════════════════════════
  // DIRECTION 5: Cryo-EM Foundation Model & Quality Validation
  // ════════════════════════════════════════════════════════
  foundation: [
    {
      title_en: "CryoFM-3D: The First 3D Volume Foundation Model",
      title_zh: "CryoFM-3D：首个 3D 密度图基础模型",
      summary_en: "Build the first true 3D cryo-EM foundation model — Cryo-IEF (Nat Methods 2025) is 2D-only; CryoFM (2024) uses only curated synthetic data.",
      summary_zh: "构建首个真正的 3D 冷冻电镜基础模型 —— Cryo-IEF (Nat Methods 2025) 只是 2D；CryoFM (2024) 仅用 curated 合成数据。",

      problem: `<p>The current state of cryo-EM foundation models is fragmented:</p><ul><li><strong>Cryo-IEF (<em>Nat Methods</em> 2025)</strong>: pretrained on 65 million particle images but is <strong>2D only</strong></li><li><strong>DRACO (2024)</strong>: 270K micrographs, MAE+N2N, also 2D</li><li><strong>CryoFM (Zhou et al. 2024)</strong>: 3D flow-based model but <strong>only on curated high-quality synthetic maps</strong>; its robustness on real noisy maps is unvalidated</li><li><strong>CryoLVM</strong>: JEPA but at micrograph level</li><li><strong>CryoCRAB (<em>Sci Data</em> 2025)</strong>: foundation model dataset is <strong>746 proteins, 2D micrographs only</strong></li></ul><p>There is <strong>NO foundation model trained on large-scale, diverse, real 3D density maps with multi-channel structural annotations</strong>. Plan A is uniquely positioned to fill this gap.</p>`,
      problem_zh: `<p>当前冷冻电镜基础模型现状分散：</p><ul><li><strong>Cryo-IEF (<em>Nat Methods</em> 2025)</strong>：在 6500 万张粒子图上预训练，<strong>只是 2D</strong></li><li><strong>DRACO (2024)</strong>：27 万显微图，MAE+N2N，也是 2D</li><li><strong>CryoFM (Zhou 等 2024)</strong>：3D 流模型，但<strong>只在 curated 高质量合成图上训练</strong>；真实噪声图鲁棒性未验证</li><li><strong>CryoLVM</strong>：JEPA 但在显微图层</li><li><strong>CryoCRAB (<em>Sci Data</em> 2025)</strong>：基础模型数据集 <strong>746 蛋白质，仅 2D 显微图</strong></li></ul><p><strong>没有任何基础模型在大规模、多样、真实 3D 密度图 + 多通道结构标注上训练</strong>。Plan A 独家定位填补这个空白。</p>`,

      approach: `<p>构建 <strong>CryoFM-3D</strong>：</p><ol><li><strong>主干</strong>：3D Swin Transformer 或 3D-MAE (ViT-3D)</li><li><strong>预训练</strong>：在 11K Plan A 密度图上做 3D Masked Autoencoder（mask 50% 体素，重建）</li><li><strong>多任务微调</strong>：同时输出 Plan A 的 8 通道标签 + 模拟密度 —— 共享 backbone，9 个 task heads</li><li><strong>多模态对齐</strong>：把 (density, atomic_model, sequence, QC metrics) 在 contrastive learning 框架下对齐，类似 CLIP 但是结构生物学版</li></ol><p><strong>下游应用</strong>：(a) zero-shot / few-shot 迁移到小数据集任务；(b) 提取 embedding 用于 retrieval；(c) 作为其他模型的 vision encoder。</p>`,
      approach_zh: `<p>构建 <strong>CryoFM-3D</strong>：</p><ol><li><strong>主干</strong>：3D Swin Transformer 或 3D-MAE (ViT-3D)</li><li><strong>预训练</strong>：在 11K Plan A 密度图上做 3D Masked Autoencoder（mask 50% 体素，重建）</li><li><strong>多任务微调</strong>：同时输出 Plan A 的 8 通道标签 + 模拟密度 —— 共享主干，9 个任务头</li><li><strong>多模态对齐</strong>：把 (density, atomic_model, sequence, QC metrics) 在对比学习框架下对齐，类似 CLIP 但结构生物学版</li></ol><p><strong>下游应用</strong>：(a) zero-shot / few-shot 迁移到小数据集任务；(b) 提取 embedding 做检索；(c) 作为其他模型的 vision encoder。</p>`,

      evaluation: `<ul><li><strong>预训练质量</strong>：MAE reconstruction loss, embedding 可视化</li><li><strong>多任务性能</strong>：8 通道标签的联合预测 F1</li><li><strong>下游迁移</strong>：在 cryo-EM small benchmarks 上 few-shot 性能（如 EM Model Challenge data）</li><li><strong>对比</strong>：每个下游任务的 SOTA（如 ModelAngelo for model building, DeepEMhancer for sharpening）</li></ul>`,
      evaluation_zh: `<ul><li><strong>预训练质量</strong>：MAE 重建 loss、embedding 可视化</li><li><strong>多任务性能</strong>：8 通道标签的联合预测 F1</li><li><strong>下游迁移</strong>：在冷冻电镜小数据集 benchmarks 上的 few-shot 性能（如 EM Model Challenge 数据）</li><li><strong>对比</strong>：每个下游任务的 SOTA（ModelAngelo 做建模、DeepEMhancer 做锐化等）</li></ul>`,

      publication: `<p><strong>目标：Nature Methods / Nature Computational Science / NeurIPS</strong>。第一个真正的 3D cryo-EM foundation model 是该领域里程碑级工作。可对标 Cryo-IEF (Nat Methods 2025)。</p><p><strong>工作量：12-18 人月</strong>。大工程，需要 GPU 集群（8+ × A100/H100）。</p>`,
      publication_zh: `<p><strong>目标：Nature Methods / Nature Computational Science / NeurIPS</strong>。首个真正的 3D 冷冻电镜基础模型是该领域里程碑级工作，可对标 Cryo-IEF (Nat Methods 2025)。</p><p><strong>工作量：12-18 人月</strong>。大工程，需 GPU 集群（8+ × A100/H100）。</p>`,

      risks: `<ul><li>11K 数据相对 Cryo-IEF 的 65M 还是小 → 用 augmentation + multi-task self-supervision 补偿</li><li>训练成本高 → 分阶段：先证 2D backbone，再扩 3D</li></ul>`,
      risks_zh: `<ul><li>11K 数据相对 Cryo-IEF 的 6500 万还是小 → 用增强 + 多任务自监督补偿</li><li>训练成本高 → 分阶段：先验证 2D 主干，再扩展 3D</li></ul>`,

      tags: ['Foundation Model', 'MAE / Contrastive', 'Multi-modal', '12-18 person-months', 'Nature Methods']
    },

    {
      title_en: "Unified AI Validator (Beyond PHENIX/EMRinger/Q-score Ensembles)",
      title_zh: "统一 AI 验证器（超越 PHENIX/EMRinger/Q-score 组合）",
      summary_en: "Train a single model that subsumes Q-score, EMRinger, PHENIX CC into a unified per-voxel quality score with confidence intervals.",
      summary_zh: "训练单一模型，将 Q-score、EMRinger、PHENIX CC 统一为带置信区间的每体素质量分数。",

      problem: `<p><strong>wwPDB now requires Q-score</strong> in validation reports (since Sep 2023). Plus EMRinger, PHENIX Map-Model FSC, EMDB Atom Inclusion are all part of validation. <strong>The 2019 EMDataResource Challenge</strong> identified clusters of related metrics — different tools measure overlapping things.</p><p>Current methods have issues: (1) <strong>DeepQs</strong> trained on only 496 pairs; (2) <strong>DAQ-score</strong> uses CNN but no QC ground truth at scale; (3) the metrics from different tools sometimes <em>disagree</em>, leaving reviewers confused; (4) no method gives <strong>uncertainty</strong> on the quality score.</p>`,
      problem_zh: `<p><strong>wwPDB 现要求验证报告中包含 Q-score</strong>（2023 年 9 月起）。再加上 EMRinger、PHENIX Map-Model FSC、EMDB Atom Inclusion 都是验证一部分。<strong>2019 EMDataResource Challenge</strong> 识别了相关指标的聚类 —— 不同工具测量重叠内容。</p><p>当前方法问题：(1) <strong>DeepQs</strong> 仅用 496 对训练；(2) <strong>DAQ-score</strong> 用 CNN 但缺乏大规模 QC 真值；(3) 不同工具指标有时<em>不一致</em>，让审稿人困惑；(4) 没有方法给出质量分数的<strong>不确定性</strong>。</p>`,

      approach: `<p>用 Plan A 的 11K 条目 + 完整 PHENIX QC 真值（CC_mask, CC_volume, CC_peaks, Q-score median, per-residue CC）训练 <strong>统一验证器</strong>：</p><ol><li>输入：density map + （可选）atomic model</li><li>输出 head 1：per-voxel quality score（连续 [0, 1]）</li><li>输出 head 2：per-residue quality + uncertainty interval</li><li>输出 head 3：global quality summary（模拟 PHENIX QC report）</li><li>输出 head 4：error detection（per-residue chain misassignment, sequence mismatch flag）</li></ol><p><strong>训练</strong>：Plan A 数据集是 <strong>22 倍于 DeepQs (496)</strong>，且有真实 PHENIX 计算的 ground truth。架构：3D ViT + ConvNeXt 混合。</p>`,
      approach_zh: `<p>用 Plan A 的 11K 条目 + 完整 PHENIX QC 真值（CC_mask, CC_volume, CC_peaks, Q-score 中位数, 每残基 CC）训练<strong>统一验证器</strong>：</p><ol><li>输入：密度图 +（可选）原子模型</li><li>输出 head 1：每体素质量分数（连续 [0, 1]）</li><li>输出 head 2：每残基质量 + 不确定区间</li><li>输出 head 3：全局质量摘要（模拟 PHENIX QC 报告）</li><li>输出 head 4：错误检测（每残基链分配错误、序列错配标记）</li></ol><p><strong>训练</strong>：Plan A 是 <strong>DeepQs (496) 的 22 倍</strong>，且有真实 PHENIX 计算的真值。架构：3D ViT + ConvNeXt 混合。</p>`,

      evaluation: `<ul><li>跟 PHENIX 真值的相关性（per-voxel, per-residue, global）</li><li>跟 EMRinger / Q-score 的一致性</li><li>错误检测：人工注入 chain misassignment / wrong residue type，看模型能否检测</li><li>对比：DeepQs (3D ViT), DAQ-score</li></ul>`,
      evaluation_zh: `<ul><li>与 PHENIX 真值的相关性（每体素、每残基、全局）</li><li>与 EMRinger / Q-score 的一致性</li><li>错误检测：人工注入链错配 / 错误残基类型，看模型能否检测</li><li>对比：DeepQs (3D ViT)、DAQ-score</li></ul>`,

      publication: `<p><strong>目标：Nature Methods</strong>。这是直接服务于 wwPDB / EMDB 验证流程的工具，被广泛部署的可能性高。<strong>DeepQs 当年发 J Struct Biol</strong>，本工作如果做得好可以冲 Nat Methods（因为数据规模大 22 倍 + 多任务 + 不确定性 + 错误检测）。</p><p><strong>工作量：6-9 人月</strong>。</p>`,
      publication_zh: `<p><strong>目标：Nature Methods</strong>。直接服务 wwPDB / EMDB 验证流程的工具，被广泛部署可能性高。<strong>DeepQs 当年发 J Struct Biol</strong>，本工作做好可冲 Nat Methods（数据规模大 22 倍 + 多任务 + 不确定性 + 错误检测）。</p><p><strong>工作量：6-9 人月</strong>。</p>`,

      risks: `<p>PHENIX 计算的 Q-score 本身有噪声 → 用 Plan A 的 Gold tier 作为高质量训练子集。</p>`,
      risks_zh: `<p>PHENIX 计算的 Q-score 本身有噪声 → 用 Plan A 的 Gold tier 作为高质量训练子集。</p>`,

      tags: ['QC / Validation', 'Multi-task', '6-9 person-months', 'Nature Methods']
    },

    {
      title_en: "Automated wwPDB Model Error Detection",
      title_zh: "自动化 wwPDB 模型错误检测",
      summary_en: "Detect chain misassignment, wrong residue type, and other systematic errors in deposited PDB models using cryo-EM density.",
      summary_zh: "用冷冻电镜密度检测已沉积 PDB 模型中的链错配、错误残基类型等系统性错误。",

      problem: `<p>The wwPDB validation system flags <em>geometry issues</em> (clashes, Ramachandran outliers) but <strong>cannot detect model-density mismatches</strong> beyond global metrics. The <strong>EMDB has ~9,000 entries with paired PDB models, ~38% lack atomic models</strong>, and among existing models there are <em>known cases of chain misassignment, residue misidentification, and systematic errors</em> that pass validation.</p><p>Manual error detection requires expert review (hours per structure). At the rate cryo-EM is growing, <strong>automated error detection becomes critical infrastructure</strong>.</p>`,
      problem_zh: `<p>wwPDB 验证系统标记<em>几何问题</em>（clash、Ramachandran outlier）但<strong>无法检测模型-密度不匹配</strong>（除全局指标）。<strong>EMDB 约 9000 条目有配对 PDB 模型，~38% 没有原子模型</strong>，已有模型中存在<em>已知的链错配、残基错识别、系统性错误</em>能通过验证。</p><p>人工错误检测需专家审核（每结构数小时）。冷冻电镜增长速度下，<strong>自动错误检测成为关键基础设施</strong>。</p>`,

      approach: `<p>训练 <strong>error detector</strong>：</p><ol><li>数据：Plan A 的 11K (density, model, ground truth labels)</li><li>合成训练样本：对每个条目人工注入错误（swap chain IDs, mutate residues, shift coordinates）</li><li>模型学习区分真实模型 vs 注入错误的模型</li><li>输出：per-residue 错误概率 + 错误类型分类（chain swap / residue mismatch / coordinate shift）</li></ol><p><strong>关键</strong>：Plan A 的 <code>label_chain</code> + <code>label_aa</code> + <code>label_qscore</code> 提供精细 ground truth。</p>`,
      approach_zh: `<p>训练<strong>错误检测器</strong>：</p><ol><li>数据：Plan A 的 11K (密度, 模型, 真值标签)</li><li>合成训练样本：每条目人工注入错误（交换链 ID、突变残基、移位坐标）</li><li>模型学习区分真实模型 vs 注入错误的模型</li><li>输出：每残基错误概率 + 错误类型分类（链交换 / 残基错配 / 坐标移位）</li></ol><p><strong>关键</strong>：Plan A 的 <code>label_chain</code> + <code>label_aa</code> + <code>label_qscore</code> 提供细粒度真值。</p>`,

      evaluation: `<ul><li>合成错误检测：AUC, F1 per error type</li><li>真实案例：找 PDB 中已知有错的条目（社区报告的），看模型能否检测</li><li>误报率：在干净模型上的 false positive rate（必须低）</li></ul>`,
      evaluation_zh: `<ul><li>合成错误检测：AUC、每类错误的 F1</li><li>真实案例：找 PDB 中已知有错的条目（社区报告的），看模型能否检测</li><li>误报率：干净模型的假阳性率（必须低）</li></ul>`,

      publication: `<p><strong>目标：Nature Communications / Bioinformatics</strong>。可以直接被 wwPDB / EMDB 集成，影响所有未来沉积。如能展示在历史 PDB 数据上的错误检测，价值巨大。</p><p><strong>工作量：4-6 人月</strong>。</p>`,
      publication_zh: `<p><strong>目标：Nature Communications / Bioinformatics</strong>。可被 wwPDB / EMDB 直接集成，影响所有未来沉积。如能展示在历史 PDB 数据上的错误检测，价值巨大。</p><p><strong>工作量：4-6 人月</strong>。</p>`,

      risks: `<p>合成错误与真实错误分布不同 → 用 mixture training，加少量真实错误案例做 fine-tuning。</p>`,
      risks_zh: `<p>合成错误与真实错误分布不同 → 混合训练，加少量真实错误案例做 fine-tuning。</p>`,

      tags: ['Error Detection', 'wwPDB Service', '4-6 person-months', 'Nature Communications']
    },

    {
      title_en: "Multimodal Cryo-EM Embedding Space (Density × Sequence × Structure)",
      title_zh: "多模态冷冻电镜嵌入空间（密度 × 序列 × 结构）",
      summary_en: "Build a CLIP-like joint embedding space where (density, sequence, atomic model) align — enabling cross-modal retrieval and transfer.",
      summary_zh: "构建 CLIP 式联合嵌入空间，让 (密度, 序列, 原子模型) 对齐 —— 支持跨模态检索与迁移。",

      problem: `<p>Cryo-EM data exists in <strong>multiple modalities</strong> (density volume, atomic model, sequence, QC metrics, validation reports). Currently each modality is processed by separate tools with no unified representation.</p><p>For example: given a sequence, can we predict which EMDB entry has the most similar structure? Given a density map, can we find similar sequences? Given QC metrics, can we predict the underlying structure class? <strong>No unified embedding space exists.</strong></p>`,
      problem_zh: `<p>冷冻电镜数据存在<strong>多种模态</strong>（密度体素、原子模型、序列、QC 指标、验证报告）。目前每种模态由独立工具处理，无统一表示。</p><p>例如：给定序列，能否预测哪个 EMDB 条目结构最相似？给定密度图，能否找相似序列？给定 QC 指标，能否预测底层结构类？<strong>没有统一嵌入空间。</strong></p>`,

      approach: `<p>训练 <strong>multimodal CLIP-style</strong> 模型：</p><ul><li>Density encoder: 3D ViT</li><li>Sequence encoder: ESM-2 frozen + adapter</li><li>Structure encoder: SE(3) Transformer on CA positions</li><li>QC encoder: simple MLP on PHENIX metrics</li></ul><p>4 个 encoder 输出同一 768-d embedding 空间。用 contrastive loss：同一条目的 (density, sequence, structure, QC) 应该 embedding 接近。</p><p><strong>下游能力</strong>：(a) 跨模态检索，(b) 缺失模态推断（给密度推序列），(c) zero-shot classification（"这个密度像什么 fold?"）。</p>`,
      approach_zh: `<p>训练 <strong>多模态 CLIP 式</strong>模型：</p><ul><li>密度编码器：3D ViT</li><li>序列编码器：ESM-2 冻结 + adapter</li><li>结构编码器：SE(3) Transformer on CA 位置</li><li>QC 编码器：PHENIX 指标上的简单 MLP</li></ul><p>4 个编码器输出同一 768 维嵌入空间。对比 loss：同条目的 (密度, 序列, 结构, QC) 嵌入应接近。</p><p><strong>下游能力</strong>：(a) 跨模态检索；(b) 缺失模态推断（给密度推序列）；(c) zero-shot 分类（"这个密度像什么 fold?"）。</p>`,

      evaluation: `<ul><li>检索准确率：用一个模态查另一个</li><li>跨模态对齐：embedding 相似度的 ranking 一致性</li><li>下游 zero-shot：CATH/SCOP 分类、fold recognition</li></ul>`,
      evaluation_zh: `<ul><li>检索准确率：用一个模态查另一个</li><li>跨模态对齐：嵌入相似度的排序一致性</li><li>下游 zero-shot：CATH/SCOP 分类、折叠识别</li></ul>`,

      publication: `<p><strong>目标：NeurIPS / ICLR / Nature Methods</strong>。这是 ML 社区感兴趣的方向（CLIP-style multimodal learning），同时对生物学社区有用（cross-modal retrieval）。</p><p><strong>工作量：6-9 人月</strong>。</p>`,
      publication_zh: `<p><strong>目标：NeurIPS / ICLR / Nature Methods</strong>。ML 社区感兴趣的方向（CLIP 风格多模态学习），同时对生物学社区有用（跨模态检索）。</p><p><strong>工作量：6-9 人月</strong>。</p>`,

      risks: `<p>密度和序列之间信息密度差距大（一张 100³ 体素图 vs 200 氨基酸序列） → 用 hierarchical pooling 让密度变成 sequence-length 表示。</p>`,
      risks_zh: `<p>密度和序列之间信息密度差距大（100³ 体素图 vs 200 氨基酸序列） → 用 hierarchical pooling 让密度变成 sequence-length 表示。</p>`,

      tags: ['Multimodal', 'CLIP-style', 'Foundation', '6-9 person-months', 'NeurIPS / Nature Methods']
    }
  ]
};
