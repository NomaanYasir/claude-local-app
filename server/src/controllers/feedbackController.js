const prisma = require('../lib/prisma');

async function report(req, res) {
  try {
    const outputId = parseInt(req.params.id, 10);
    const { message } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required' });

    const output = await prisma.aIOutput.findUnique({ where: { id: outputId }, include: { task: true } });
    if (!output) return res.status(404).json({ error: 'Output not found' });
    if (output.task.userId !== req.user.id) return res.status(403).json({ error: 'Not authorized to report this output' });

    const fb = await prisma.feedback.create({ data: { outputId: output.id, taskId: output.taskId, userId: req.user.id, message } });
    res.json({ ok: true, feedback: fb });
  } catch (err) {
    console.error('Feedback report error', err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { report };
