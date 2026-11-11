export function getDaysRemaining(expiryDateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function formatExpiryDisplay(expiryDateStr: string): {
  text: string;
  isUrgent: boolean;
  formattedDate: string;
} {
  const days = getDaysRemaining(expiryDateStr);
  const dateObj = new Date(expiryDateStr);
  const formattedDate = dateObj.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (days < 0) {
    return { text: 'Expired', isUrgent: true, formattedDate };
  }
  if (days === 0) {
    return { text: 'Expires today', isUrgent: true, formattedDate };
  }
  if (days === 1) {
    return { text: 'Expires tomorrow', isUrgent: true, formattedDate };
  }
  if (days <= 3) {
    return { text: `Expires in ${days} days`, isUrgent: true, formattedDate };
  }
  return { text: `Best before ${formattedDate}`, isUrgent: false, formattedDate };
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
